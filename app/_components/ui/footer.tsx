import { Card, CardContent } from "./card"

const Footer = () => {
  return (
    <footer>
      <Card>
        <CardContent className="px-5 py-6">
          <p className="text-sm text-gray-400">
            {" "}
            @2025 <span className="font-semibold">BarberShop Ozias</span>
          </p>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
