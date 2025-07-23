
import { Octokit } from 'octokit';

/**
 * Fetches a user's public repositories from GitHub.
 * @param username The GitHub username.
 * @param accessToken The user's GitHub OAuth access token.
 * @returns A list of project descriptions.
 */
export async function getGithubRepositories(
  username: string,
  accessToken: string
): Promise<string[]> {
  console.log(`Fetching repositories for ${username} using the GitHub API.`);
  try {
    const octokit = new Octokit({ auth: accessToken });

    const repos = await octokit.request('GET /users/{username}/repos', {
      username: username,
      type: 'owner',
      sort: 'updated',
      per_page: 20, // Get the 20 most recently updated repos
    });

    if (repos.status !== 200) {
      console.error('Failed to fetch repositories from GitHub API:', repos);
      return [];
    }

    console.log(`Successfully fetched ${repos.data.length} repositories.`);
    
    // Return the repository name and description for analysis.
    return repos.data
      .map(repo => {
        if (repo.description) {
          return `${repo.name}: ${repo.description}`;
        }
        return repo.name;
      })
      .filter((desc): desc is string => desc !== null);
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw new Error('Could not fetch repository data from GitHub.');
  }
}
