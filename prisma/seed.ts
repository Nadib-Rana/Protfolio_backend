import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, AdminRole, ProjectStatus, TutorialLevel } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "postgresql://asar_admin:asar_password_2026@localhost:6098/asar_db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: adminPassword,
      role: AdminRole.SUPER_ADMIN,
    },
  });

  // 2. Default Projects
  const projects = [
    {
      slug: "saas-multi-tenant-architecture",
      title: "Saas Multi-Tenant Architecture",
      description: "Production-ready NestJS multi-tenant API engine with schema isolation, JWT RBAC, dynamic connection pooling, and Redis caching.",
      period: "2026",
      status: ProjectStatus.Live,
      team: "Solo Project",
      projectType: "Backend Microservice",
      architectureFlow: "Client -> Nginx SSL -> NestJS Gateway -> Redis Cache -> PostgreSQL Isolation",
      githubUrl: "https://github.com/Nadib-Rana",
      liveDemoUrl: "https://github.com/Nadib-Rana",
      modules: ["Auth Guard", "Tenant Context", "Redis L2 Cache", "Prisma Repository"],
      features: ["Schema per Tenant Isolation", "JWT Access & Refresh Tokens", "Swagger API Spec"],
      tags: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Docker"],
    },
    {
      slug: "microservice-event-bus",
      title: "High-Throughput Event Bus Microservice",
      description: "Distributed event streaming microservice using RabbitMQ and NestJS CQRS pattern for asynchronous task execution.",
      period: "2025 - 2026",
      status: ProjectStatus.Live,
      team: "Lead Backend Developer",
      projectType: "API Engine",
      architectureFlow: "Producer -> RabbitMQ Queue -> Worker Nodes -> Database Write Pool",
      githubUrl: "https://github.com/Nadib-Rana",
      modules: ["Event Publisher", "Dead-Letter Queue Handler", "Retry Engine"],
      features: ["Decoupled Event Architecture", "Exponential Backoff Retries", "Metric Dashboard"],
      tags: ["NestJS", "RabbitMQ", "TypeScript", "PostgreSQL", "Docker"],
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // 3. Default Blog Posts
  const blogs = [
    {
      slug: "building-scalable-nestjs-architecture",
      title: "Building Enterprise Scalable NestJS Architecture",
      summary: "A practical guide on structuring modular NestJS microservices with domain-driven design, Prisma ORM, and clean layer boundaries.",
      category: "Backend Architecture",
      publishedAt: "May 2026",
      readTime: "8 min read",
      featured: true,
      intro: "Structuring enterprise NestJS applications requires clean module boundaries and explicit layer isolation.",
      conclusion: "Adopting modular boundaries makes NestJS applications predictable and easy to scale.",
      highlights: ["Controller-Service-Repository pattern", "Custom Exception Filters", "Centralized Interceptors"],
      tags: ["NestJS", "Architecture", "TypeScript", "PostgreSQL"],
    },
  ];

  for (const b of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }

  // 4. Default Services
  const services = [
    {
      slug: "full-stack-development",
      title: "Full Stack SaaS Development",
      description: "Complete end-to-end product development combining NestJS backend APIs, PostgreSQL database, Next.js / React frontend, and Docker deployment.",
      iconLabel: "Layers3",
      deliverables: [
        "Relational Database Architecture & Prisma Migrations",
        "NestJS Modular API Engine & JWT Auth",
        "Next.js / React High-Performance Frontend",
        "Docker Containerization & Dokploy VPS Deployment",
      ],
      bestFor: "Startups and teams building complete products from scratch.",
    },
  ];

  for (const s of services) {
    await prisma.serviceOffering.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 5. Default Tutorials
  const tutorials = [
    {
      slug: "nest-js-saas-api-architecture",
      title: "NestJS SaaS API Architecture from Scratch",
      summary: "A step-by-step tutorial on structuring a maintainable NestJS backend for SaaS products, with modules, auth, and clean boundaries.",
      category: "Backend",
      publishedAt: "May 2026",
      duration: "24 min",
      level: TutorialLevel.Intermediate,
      highlights: ["Project structure and module organization", "Auth flow and tenant-aware APIs"],
      topics: ["NestJS Modules", "Dependency Injection", "Guards"],
    },
  ];

  for (const t of tutorials) {
    await prisma.tutorialVideo.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }

  // 6. Default Tech Stack Categories
  const techCategories = [
    {
      iconKey: "Server",
      title: "Backend Core",
      description: "Production API engines, microservices, and server-side framework architecture.",
      gradient: "bg-gradient-to-br from-[#61DAFB]/20 via-[#61DAFB]/10 to-transparent border-[#61DAFB]/30",
      tagsJson: [
        { label: "NestJS", variant: "primary" },
        { label: "Node.js", variant: "success" },
        { label: "TypeScript", variant: "primary" },
        { label: "Express", variant: "accent" },
      ],
      sortOrder: 1,
    },
  ];

  for (const tc of techCategories) {
    const existing = await prisma.techStackCategory.findFirst({ where: { title: tc.title } });
    if (!existing) {
      await prisma.techStackCategory.create({ data: tc });
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
