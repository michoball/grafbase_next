import { ProjectForm } from "@/common.types";
import {
  createProjectMutation,
  createUserMutation,
  getUserQuery,
  projectsQuery,
} from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === "production";
const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ""
  : "http://127.0.0.1:4000/graphql";
const apiKey = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ""
  : "letmein";
const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : "http://localhost:3000";

const client = new GraphQLClient(
  "https://grafbasenext-master-michoball.grafbase.app/graphql"
);

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (error) {
    throw error;
  }
};

export const getUser = (email: string) => {
  client.setHeader(
    "x-api-key",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTQ4Njc4NTcsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFIQUVaWTc3R1cyWUtNV1JXTU5XUDdaTkgiLCJqdGkiOiIwMUhBRVpZOEVOREYzUjU5TVo5UVg5RDgzWiIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.WiaQP8js0vkAf1C_28UKT0mQ6KMfsDV51BCRpZ5GBo8"
  );
  return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader(
    "x-api-key",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTQ4Njc4NTcsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFIQUVaWTc3R1cyWUtNV1JXTU5XUDdaTkgiLCJqdGkiOiIwMUhBRVpZOEVOREYzUjU5TVo5UVg5RDgzWiIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.WiaQP8js0vkAf1C_28UKT0mQ6KMfsDV51BCRpZ5GBo8"
  );

  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };

  return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (imagePath: string) => {
  try {
    const res = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });

    return res.json();
  } catch (error) {
    throw error;
  }
};

export const createNewProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`);

    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createBy: {
          link: creatorId,
        },
      },
    };

    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const fetchAllProjects = async (
  category?: string,
  endcursor?: string
) => {
  client.setHeader(
    "x-api-key",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTQ4Njc4NTcsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFIQUVaWTc3R1cyWUtNV1JXTU5XUDdaTkgiLCJqdGkiOiIwMUhBRVpZOEVOREYzUjU5TVo5UVg5RDgzWiIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.WiaQP8js0vkAf1C_28UKT0mQ6KMfsDV51BCRpZ5GBo8"
  );

  return makeGraphQLRequest(projectsQuery, { category, endcursor });
};
