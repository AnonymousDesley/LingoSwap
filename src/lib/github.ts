
import { Octokit } from "octokit";

export function getOctokit(token?: string) {
    return new Octokit({
        auth: token,
        userAgent: "LingoSwap/1.0",
    });
}

export async function checkRepoAccess(repoUrl: string, token?: string) {
    try {
        const octokit = getOctokit(token);
        // Parse owner/repo from URL
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return { valid: false, error: "Invalid GitHub URL" };

        const [_, owner, repoName] = match;

        // Clean repo name (remove .git if present)
        const cleanRepoName = repoName.replace('.git', '');

        const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
            owner,
            repo: cleanRepoName,
        });

        return { valid: true, data };
    } catch (error: any) {
        if (error.status === 404 || error.status === 403) {
            return { valid: false, error: "Private or Not Found", needsToken: true };
        }
        return { valid: false, error: error.message };
    }
}
