-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TECHNICIAN', 'CUSTOMER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicianDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "experience" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "imageUtl" TEXT NOT NULL,
    "certificateUrl" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "rate" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TechnicianDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_details" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "emergencyContact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicianDetails_userId_key" ON "TechnicianDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_details_userId_key" ON "customer_details"("userId");

-- AddForeignKey
ALTER TABLE "TechnicianDetails" ADD CONSTRAINT "TechnicianDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_details" ADD CONSTRAINT "customer_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
