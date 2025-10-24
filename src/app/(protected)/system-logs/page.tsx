import React from "react";
import Heading from "@/components/globals/heading";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";
import { LogsWithUser } from "@/types";

const Page = () => {
  const data: LogsWithUser[] = [
    {
      id: "hmywrfyrr42rs9if9um3r45jw7f8g45fgu",
      userId: "fjsmdurh43r8kwyfwgymrt43rt",
      user: {
        username: "kylemastercoder",
        id: "fjsmdurh43r8kwyfwgymrt43rt",
        image:
          "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/548127105_2274504586333260_777294764585728994_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHA0296KZIaTn3EvPSgUJXpe6husOrbK1p7qG6w6tsrWmfyQ0Gw0VZ8YdzdKRta1dKN18J5-VzappAng7X7TTls&_nc_ohc=0hgp98_kiMwQ7kNvwGiwUAJ&_nc_oc=AdnUvlE6PJ1a6wc_ZGLDMYuW2vMmXA8zuc0W0RP9ywpxPuXxqN0701RGnwL4XNJvoX0&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=4uitzIsa-pJqzz7iKuecyw&oh=00_AfcLOrTE-w8pCiPTV0w2IVrFN_55gmbjyMiRnEKMuIrSmQ&oe=6901470E",
      },
      action: "Create new profile",
      details: "Created a new profile",
      createdAt: new Date(),
    },
	{
      id: "hmywrfyrr42rs9if9um3r45jw7f8g45fgu",
      userId: "fjsmdurh43r8kwyfwgymrt43rt",
      user: {
        username: "kylemastercoder",
        id: "fjsmdurh43r8kwyfwgymrt43rt",
        image:
          "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/548127105_2274504586333260_777294764585728994_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHA0296KZIaTn3EvPSgUJXpe6husOrbK1p7qG6w6tsrWmfyQ0Gw0VZ8YdzdKRta1dKN18J5-VzappAng7X7TTls&_nc_ohc=0hgp98_kiMwQ7kNvwGiwUAJ&_nc_oc=AdnUvlE6PJ1a6wc_ZGLDMYuW2vMmXA8zuc0W0RP9ywpxPuXxqN0701RGnwL4XNJvoX0&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=4uitzIsa-pJqzz7iKuecyw&oh=00_AfcLOrTE-w8pCiPTV0w2IVrFN_55gmbjyMiRnEKMuIrSmQ&oe=6901470E",
      },
      action: "Login",
      details: "Login",
      createdAt: new Date(),
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Manage System Logs"
          description="Browse all the actions by employee in your system."
        />
      </div>

      <div className="mt-5">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Filter by employee ID or username..."
        />
      </div>
    </div>
  );
};

export default Page;
