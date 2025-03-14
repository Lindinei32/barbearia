import { Card, CardContent } from "./card"
import Image from "next/image"
import Sidebarsheet from "./sidebarsheet"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <Image src="/logo.png" alt="logo" width={120} height={18} />
        <Sidebarsheet />
      </CardContent>
    </Card>
  )
}
export default Header
