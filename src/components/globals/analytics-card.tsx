import { IconTrendingDown, IconTrendingUp, IconBabyCarriage, IconHeartbeat, IconStethoscope, IconWoman, IconUser, IconUsersGroup } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AnalyticsCard() {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
      {/* Total Populations */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Populations</CardDescription>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2 @[250px]/card:text-3xl">
            <IconUsersGroup className="text-pink-500" /> 128
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600 bg-green-300/20">
              <IconTrendingUp className="size-4" />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* New Mothers Registered */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Mothers Registered</CardDescription>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2 @[250px]/card:text-3xl">
            <IconWoman className="text-rose-400" /> 45
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-red-600 bg-red-300/20">
              <IconTrendingDown className="size-4" />
              -5.3%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Active Prenatal Patients */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Prenatal Patients</CardDescription>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2 @[250px]/card:text-3xl">
            <IconStethoscope className="text-purple-500" /> 212
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600 bg-green-300/20">
              <IconTrendingUp className="size-4" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Birth Rate Growth */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Birth Rate Growth</CardDescription>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2 @[250px]/card:text-3xl">
            <IconHeartbeat className="text-red-500" /> 4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green- bg-green-300/20">
              <IconTrendingUp className="size-4" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}
