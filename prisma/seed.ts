import { BillingCycle, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

async function main() {
    let mypass = bcrypt.hashSync("password", 10);
    await prisma.user.upsert({
        where: {id: 1},
        update: {},
        create: { email: 'admin@nenopress.com', name: 'admin', password: mypass}
    })

    await prisma.subscriptionStatuses.upsert({
        where: {id: 1},
        update: {},
        create: { value: 0, name: 'inactive'}
    })

    await prisma.subscriptionStatuses.upsert({
        where: {id: 2},
        update: {},
        create: { value: 1, name: 'active'}
    })

    await prisma.subscriptionPackages.upsert({
        where: {id: 1},
        update: {},
        create: { 
            name: 'Basic', 
            price: 5,
            billingCycle: BillingCycle.monthly 
        },
    })
    await prisma.subscriptionPackages.upsert({
        where: {id: 1},
        update: {},
        create: { 
            name: 'Basic', 
            price: 5,
            billingCycle: BillingCycle.monthly 
        },
    })

    await prisma.subscriptionPackages.upsert({
        where: {id: 2},
        update: {},
        create: { 
            name: 'Advanced', 
            price: 10,
            billingCycle: BillingCycle.monthly 
        },
    })

    await prisma.subscriptionPackages.upsert({
        where: {id: 3},
        update: {},
        create: { 
            name: 'Premium', 
            price: 100,
            billingCycle: BillingCycle.monthly 
        },
    })

    await prisma.packageFeatures.upsert({
        where: {id: 1},
        update: {},
        create: {name: "Prompts", description: "The number of prompts per package"}

    })

    await prisma.packageFeatures.upsert({
        where: {id: 2},
        update: {},
        create: {name: "Sites", description: "The number of sites per package"}

    })

    await prisma.subscriptionFeatures.upsert({
        where: {id: 1},
        update: {},
        create: {subscriptionPackageId: 1, packageFeatureId: 1, featureLimit: 20}

    })
    await prisma.subscriptionFeatures.upsert({
        where: {id: 2},
        update: {},
        create: {subscriptionPackageId: 1, packageFeatureId: 2, featureLimit: 1}

    })
    await prisma.subscriptionFeatures.upsert({
        where: {id: 3},
        update: {},
        create: {subscriptionPackageId: 2, packageFeatureId: 1, featureLimit: 50}

    })
    await prisma.subscriptionFeatures.upsert({
        where: {id: 4},
        update: {},
        create: {subscriptionPackageId: 2, packageFeatureId: 2, featureLimit: 2}

    })
    await prisma.subscriptionFeatures.upsert({
        where: {id: 5},
        update: {},
        create: {subscriptionPackageId: 3, packageFeatureId: 1, featureLimit: 350}

    })
    await prisma.subscriptionFeatures.upsert({
        where: {id: 6},
        update: {},
        create: {subscriptionPackageId: 3, packageFeatureId: 2, featureLimit: 1000}

    })
 
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })