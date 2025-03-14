import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    const barbershop = {
      name: "Ozias Cabelereito",
      address: "Rua Benjamin Possebom, 52",
      description: "Uma barbearia de luxo",
      imageUrl:
        "https://utfs.io/f/988646ea-dcb6-4f47-8a03-8d4586b7bc21-16v.png",
      phones: "(11) 99999-9999, (11) 99999-1234",
    }

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 40.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.0,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
    ]

    const createdBarbershop = await prisma.barbershop.create({
      data: barbershop,
    })

    for (const service of services) {
      await prisma.barbershopService.create({
        data: {
          ...service,
          barbershop: {
            connect: {
              id: createdBarbershop.id,
            },
          },
        },
      })
    }
  } catch (error) {
    console.error("Erro ao criar a barbearia:", error)
  }
}

seedDatabase()
