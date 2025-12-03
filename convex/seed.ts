import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const usersData = [
      { userId: "alice_subject", email: "alice@example.com", name: "Alice Johnson" },
      { userId: "bob_subject", email: "bob@example.com", name: "Bob Smith" },
    ];

    for (const u of usersData) {
      await ctx.db.insert("users", u);
    }

    const resumesData = [
      {
        userId: "alice_subject",
        title: "Product Manager Resume",
        templateId: "clean",
        colorId: "orange",
        data: {
          contactInfo: {
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            phone: "+1 (555) 123-4567",
            city: "San Francisco",
          },
          summary: "Product manager with 7+ years leading cross‑functional teams to ship B2B SaaS.",
          experiences: [
            {
              jobTitle: "Senior Product Manager",
              employer: "Acme SaaS Co.",
              city: "San Francisco, CA",
              startDate: "2021-03",
              endDate: "Present",
              description: [
                "Led 3 squads delivering features used by 50k+ MAUs",
                "Improved conversion by 12% via pricing experiments",
              ],
            },
          ],
          education: [
            {
              degree: "BS Computer Science",
              school: "UC Berkeley",
              graduationDate: "2016",
            },
          ],
          skills: ["Roadmapping", "A/B Testing", "SQL", "Figma"],
          certifications: [],
          colorId: "orange",
          templateId: "clean",
        },
      },
      {
        userId: "bob_subject",
        title: "Full‑Stack Developer Resume",
        templateId: "modern",
        colorId: "blue",
        data: {
          contactInfo: {
            firstName: "Bob",
            lastName: "Smith",
            email: "bob@example.com",
            phone: "+1 (555) 987-6543",
            city: "New York",
          },
          summary: "Full‑stack engineer specializing in TypeScript, React, Node, and Postgres.",
          experiences: [
            {
              jobTitle: "Software Engineer",
              employer: "Startup Labs",
              city: "New York, NY",
              startDate: "2022-01",
              endDate: "Present",
              description: [
                "Built resume builder features improving retention by 8%",
                "Reduced page load by 35% via code splitting",
              ],
            },
          ],
          education: [
            {
              degree: "MS Computer Science",
              school: "NYU",
              graduationDate: "2020",
            },
          ],
          skills: ["TypeScript", "React", "Node", "Convex"],
          certifications: [],
          colorId: "blue",
          templateId: "modern",
        },
      },
    ];

    for (const r of resumesData) {
      await ctx.db.insert("resumes", r);
    }

    const coverLettersData = [
      {
        userId: "alice_subject",
        title: "PM Cover Letter",
        templateId: "basic-cl",
        colorId: "orange",
        data: {
          senderInfo: {
            fullName: "Alice Johnson",
            email: "alice@example.com",
            phone: "+1 (555) 123-4567",
            city: "San Francisco",
          },
          recipientInfo: {
            company: "Acme SaaS Co.",
            hiringManager: "Hiring Manager",
            city: "San Francisco",
          },
          subject: "Application for Senior Product Manager",
          body: "I’m excited to apply for the Senior PM role at Acme...",
          templateId: "basic-cl",
          colorId: "orange",
        },
      },
      {
        userId: "bob_subject",
        title: "Developer Cover Letter",
        templateId: "basic-cl",
        colorId: "blue",
        data: {
          senderInfo: {
            fullName: "Bob Smith",
            email: "bob@example.com",
            phone: "+1 (555) 987-6543",
            city: "New York",
          },
          recipientInfo: {
            company: "Startup Labs",
            hiringManager: "CTO",
            city: "New York",
          },
          subject: "Application for Full‑Stack Engineer",
          body: "I’ve built production systems with React, Node, and Convex...",
          templateId: "basic-cl",
          colorId: "blue",
        },
      },
    ];

    for (const cl of coverLettersData) {
      await ctx.db.insert("coverLetters", cl);
    }

    return {
      usersInserted: usersData.length,
      resumesInserted: resumesData.length,
      coverLettersInserted: coverLettersData.length,
    };
  },
});
