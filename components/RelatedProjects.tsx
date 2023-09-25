import { ProjectInterface, UserProfile } from "@/common.types";
import { getUserProject } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  userId: string;
  projectId: string;
};

const RelatedProjects = async ({ userId, projectId }: Props) => {
  const result = (await getUserProject(userId)) as { user?: UserProfile };

  const filteredProject = result?.user?.projects?.edges?.filter(
    ({ node }: { node: ProjectInterface }) => node?.id !== projectId
  );

  if (!filteredProject?.length) return null;

  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p className="text-base font-bold">More by {result?.user?.name}</p>
        <Link
          href={`/profile${result?.user?.id}`}
          className="text-primary-purple text-base"
        >
          View All
        </Link>
      </div>
      <div className="relative_projects-grid">
        {filteredProject?.map(({ node }: { node: ProjectInterface }) => (
          <div
            key={node.id}
            className="flexCenter relative_project-card drop-shadow-card"
          >
            <Link
              href={`/project/${node?.id}`}
              className="flexCenter group relative w-full h-full"
            >
              <Image
                src={node?.image}
                width={414}
                height={314}
                className="w-full h-full object-cover rounded-2xl"
                alt="project image"
              />

              <div className="hidden group-hover:flex related_project-card_title">
                <p className="w-full">{node?.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProjects;
