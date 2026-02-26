import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) return "N/A";
  return `PHP ${value.toLocaleString()}`;
};

const formatDate = (value: Date) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const Page = async (props: {
  params: Promise<{
    householdId: string;
  }>;
}) => {
  const params = await props.params;
  const householdId = params.householdId;

  if (!householdId) {
    notFound();
  }

  const household = await db.houseHold.findUnique({
    where: {
      id: householdId,
    },
    include: {
      profiles: {
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      },
    },
  });

  if (!household) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Heading
          title={`Household #${household.householdNumber}`}
          description="View household details and all profiles under this household."
        />
        <Button variant="outline" asChild>
          <Link href="/barangay-profiling/households">Back to Households</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Household Number</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            #{household.householdNumber}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Location</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {household.location || "N/A"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {formatCurrency(household.monthlyIncome)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Profiles Found</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {household.profiles.length}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Household Record Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm text-muted-foreground">Household ID</span>
              <span className="text-sm font-medium break-all text-right">
                {household.id}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm text-muted-foreground">Created At</span>
              <span className="text-sm font-medium">
                {formatDate(household.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm text-muted-foreground">Updated At</span>
              <span className="text-sm font-medium">
                {formatDate(household.updatedAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Profiles in This Household</CardTitle>
          <Button size="sm" asChild>
            <Link href="/barangay-profiling/profile/create">Add Profile</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {household.profiles.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
              No profiles found for this household yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {household.profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.lastName}, {profile.firstName}
                      {profile.middleName ? ` ${profile.middleName}` : ""}
                    </TableCell>
                    <TableCell>{profile.relationship || "N/A"}</TableCell>
                    <TableCell>{profile.sex || "N/A"}</TableCell>
                    <TableCell>{profile.age ?? "N/A"}</TableCell>
                    <TableCell>{formatDate(profile.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/barangay-profiling/profile/${profile.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
