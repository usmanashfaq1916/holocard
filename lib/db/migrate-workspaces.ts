import { prisma } from "@/lib/db";

export async function migrateCardsToWorkspaces() {
  const users = await prisma.user.findMany({
    include: { workspaces: true, cards: true },
  });

  for (const user of users) {
    let workspace = user.workspaces.find((w) => w.isDefault);
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          userId: user.id,
          name: "My Workspace",
          isDefault: true,
        },
      });
    }

    let project = await prisma.project.findFirst({
      where: { workspaceId: workspace.id, isDefault: true },
    });
    if (!project) {
      project = await prisma.project.create({
        data: {
          workspaceId: workspace.id,
          name: "Default Project",
          isDefault: true,
        },
      });
    }

    const orphanedCards = user.cards.filter(
      (c) => !c.workspaceId || !c.projectId
    );
    if (orphanedCards.length > 0) {
      await prisma.card.updateMany({
        where: { id: { in: orphanedCards.map((c) => c.id) } },
        data: { workspaceId: workspace.id, projectId: project.id },
      });
      console.log(
        `Migrated ${orphanedCards.length} cards for user ${user.email}`
      );
    }
  }
}
