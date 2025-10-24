import React from "react";
import Heading from "@/components/globals/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";
import { User } from "@prisma/client";

const Page = () => {
  const data: User[] = [
    {
      id: "hmywrfyrr42rs9if9um3r45jw7f8g45fgu",
      name: "Kyle Andre Lim",
      image:
        "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/548127105_2274504586333260_777294764585728994_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHA0296KZIaTn3EvPSgUJXpe6husOrbK1p7qG6w6tsrWmfyQ0Gw0VZ8YdzdKRta1dKN18J5-VzappAng7X7TTls&_nc_ohc=0hgp98_kiMwQ7kNvwGiwUAJ&_nc_oc=AdnUvlE6PJ1a6wc_ZGLDMYuW2vMmXA8zuc0W0RP9ywpxPuXxqN0701RGnwL4XNJvoX0&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=4uitzIsa-pJqzz7iKuecyw&oh=00_AfcLOrTE-w8pCiPTV0w2IVrFN_55gmbjyMiRnEKMuIrSmQ&oe=6901470E",
      role: "ADMIN",
      password: "12345678",
      username: "kylemastercoder",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

	{
      id: "hfg420isfpsd9umf43tsadfhjkgifdsg842",
      name: "Marjorie Gamboa",
      image:
        "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/487568506_3875114112729520_5256280434383854592_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEoiiS_OlawARogh6loHOVrT7jZuNmK485PuNm42YrjzuIi8wgviSAhe_adMzT6k3x0Wui5831cxpjoZUX6GPZs&_nc_ohc=o8RNidBtxAcQ7kNvwHXD55r&_nc_oc=Adn-Gy8j1d704kH4P4LZJZuDJCMmccwbYm64zZfQ25L3URab6gI6pDqy3w8ybcE-Xs0&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=yGAlDiQbNemmMDcFgTlNfA&oh=00_AffDeimqv0t90g5C5qFWK7VyjfiffBRLBTpnmnJ0H-sf_A&oe=69011BAA",
      role: "STAFF",
      password: "12345678",
      username: "ememgamboa",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Employee Management"
          description="Browse and manage all employees in your system."
        />
        <Button size="sm">
          <Link
            href="/manage-employees/create"
            className="flex items-center gap-2"
          >
            <IconPlus className="size-4" />
            Create new employee
          </Link>
        </Button>
      </div>

      <div className="mt-5">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Filter employee ID or name..."
        />
      </div>
    </div>
  );
};

export default Page;
