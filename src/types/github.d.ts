/**
 * Names of different tables
 */
declare type Table =
  | "github_last_update"
  | "github_repository"
  | "github_repository_owners"
  | "github_languages";

/**
 * Properties of the owners table
 */
declare type Owner = {
  login: string;
  avatar_url: string;
  html_url: string;
  type: "User" | "Organization" | "Bot" | "Mannequin";
};

/**
 * Types of repository visiblity
 */
declare type Visibility = "public" | "private";

/**
 * Properties of the repository table, also known as simplified repositories
 */
declare type SimplifiedRepository = {
  name: string;
  html_url: string;
  owner: string;
  visibility: Visibility;
  description: string | null;
  fork: boolean;
  archived: boolean;
  languages_url: string;
  order: number;
};

declare type RepositorySimplificationResult = {
  simplified: SimplifiedRepository[];
  owners: Owner[];
};

/**
 * Properties of GitHub repositories, also known as completed repositories
 */
declare type Repository = Omit<SimplifiedRepository, "owner" | "order"> & {
  owner: Owner;
};

/**
 * Properties of the last update metadata table
 */
declare type LastUpdate = {
  scope: "repositories" | "languages";
  epoch: number;
};

/**
 * Properties of a language row
 */
declare type LanguageMetadata = {
  language: string;
  bytes: number;
};
