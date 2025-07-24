
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/hooks/use-user';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import type { User as UserProfile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, User as UserIcon, Bot, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Chat {
  id: string;
  otherMember: UserProfile;
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
}

export function MessagesView({ initialChatId }: { initialChatId?: string | null }) {
  const { user, profile, loading: profileLoading } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const chatsQuery = query(
        collection(db, 'chats'),
        where('members', 'array-contains', user.uid),
        orderBy('lastMessageTimestamp', 'desc')
      );

      const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
        const chatsData: Chat[] = await Promise.all(
          snapshot.docs.map(async (docData) => {
            const chat = docData.data();
            const otherMemberId = chat.members.find((id: string) => id !== user.uid);
            // Handle case where otherMemberId might be undefined (self-chat, etc.)
            if (!otherMemberId) return null;
            const userDoc = await getDoc(doc(db, 'users', otherMemberId));
            if (!userDoc.exists()) return null; // Skip if the other user's profile doesn't exist

            const otherMember = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
            return {
              id: docData.id,
              otherMember,
              lastMessage: chat.lastMessage,
              lastMessageTimestamp: chat.lastMessageTimestamp,
            };
          })
        );
        
        const validChats = chatsData.filter((chat): chat is Chat => chat !== null);
        setChats(validChats);

        // Always set loading to false after the first snapshot is processed.
        setLoadingChats(false);

        if (initialChatId && !selectedChat) {
            const initialSelectedChat = validChats.find(c => c.id === initialChatId);
            if (initialSelectedChat) {
                setSelectedChat(initialSelectedChat);
            }
        } else if (!selectedChat && validChats.length > 0) {
            setSelectedChat(validChats[0]);
        }
      }, (error) => {
          console.error("Error fetching chats:", error);
          setLoadingChats(false); // Also stop loading on error
      });

      return () => unsubscribe();
    } else if (!profileLoading) {
      // If there's no user and we're not in a loading state, stop loading chats.
      setLoadingChats(false);
    }
  }, [user, initialChatId, profileLoading]);

  useEffect(() => {
    if (selectedChat) {
      setLoadingMessages(true);
      const messagesQuery = query(
        collection(db, 'chats', selectedChat.id, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(messagesData);
        setLoadingMessages(false);
      }, (error) => {
          console.error(`Error fetching messages for chat ${selectedChat.id}:`, error);
          setLoadingMessages(false);
      });

      return () => unsubscribe();
    } else {
        setMessages([]); // Clear messages if no chat is selected
    }
  }, [selectedChat]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    const chatDocRef = doc(db, 'chats', selectedChat.id);

    await addDoc(collection(chatDocRef, 'messages'), {
      senderId: user.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    });
    
    // Also update the last message on the chat document itself
    await updateDoc(chatDocRef, {
        lastMessage: newMessage,
        lastMessageTimestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  if (profileLoading || (loadingChats && !chats.length)) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="h-[80vh] flex">
      {/* Sidebar with chat list */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>
        <ScrollArea className="flex-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                'flex items-center gap-3 p-4 cursor-pointer hover:bg-muted',
                selectedChat?.id === chat.id && 'bg-muted'
              )}
            >
              <Avatar>
                <AvatarImage src={chat.otherMember.photoURL || ''} alt={chat.otherMember.name} />
                <AvatarFallback>{chat.otherMember.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <p className="font-semibold truncate">{chat.otherMember.name}</p>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
              {chat.lastMessageTimestamp && (
                 <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(chat.lastMessageTimestamp.toDate(), { addSuffix: true })}
                 </p>
              )}
            </div>
          ))}
           {chats.length === 0 && !loadingChats && (
                <div className="text-center p-8 text-muted-foreground">No conversations yet.</div>
           )}
        </ScrollArea>
      </div>

      {/* Main chat window */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar>
                 <AvatarImage src={selectedChat.otherMember.photoURL || ''} alt={selectedChat.otherMember.name} />
                 <AvatarFallback>{selectedChat.otherMember.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{selectedChat.otherMember.name}</h2>
            </div>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex items-end gap-2',
                        message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.senderId !== user?.uid && (
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={selectedChat.otherMember.photoURL || ''} alt={selectedChat.otherMember.name} />
                           <AvatarFallback>{selectedChat.otherMember.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn(
                          "p-3 rounded-lg max-w-md",
                          message.senderId === user?.uid
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                      )}>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ))
                )}
                 {messages.length === 0 && !loadingMessages && (
                    <div className="text-center p-8 text-muted-foreground">
                        This is the beginning of your conversation.
                    </div>
                 )}
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-muted-foreground">
            <MessageSquare size={48} />
            <p className="mt-4 text-lg">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </Card>
  );
}
