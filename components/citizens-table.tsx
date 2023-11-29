"use client"

import { Abi, parseAbiItem } from "viem"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Suspense, useState } from "react"
import { useContractReads, usePublicClient, useQuery } from "wagmi"
import { citizenContractConfig } from "@/lib/contracts"

type Citizen = {
  id: number
  age: number
  city: string
  name: string
  note: string
}

type CitMulticall = {
  functionName: string
  args: BigInt[]
  address: `0x${string}`
  abi: Abi
}

const eventInterface =
  "event Citizen(uint indexed id, uint indexed age, string indexed city, string name)"

export function CitizensTable() {
  const [citizens, setCitizens] = useState<Citizen[]>([])
  const [citizensMulticallArg, setCitizensMulticallArg] = useState<
    CitMulticall[]
  >([])
  const publicClient = usePublicClient()

  const { data, isSuccess: isCitizensSuccess } = useQuery(
    ["citizens"],
    async () => {
      const logs =
        (await publicClient.getLogs({
          address: "0xa011799d9467d2b33768fb1a3512f1b468b87e96",
          event: parseAbiItem(eventInterface),
          fromBlock: 2273494n,
          toBlock: "latest",
        })) ?? []

      const citizens: Citizen[] = logs.map((citizen: any) => {
        const {
          args: { id, age, city, name },
        } = citizen
        return {
          id: Number(id),
          age: Number(age),
          city,
          name,
          note: "temp note",
        }
      })

      const citizensMulticallArg = citizens.map((citizen) => ({
        ...citizenContractConfig,
        functionName: "getNoteByCitizenId",
        args: [BigInt(citizen.id)],
      }))

      setCitizensMulticallArg(citizensMulticallArg)

      return citizens
    }
  )

  useContractReads({
    contracts: citizensMulticallArg,
    onSuccess: (contractReads) => {
      setCitizens(
        data?.map((citizen, i) => ({
          ...citizen,
          note: contractReads?.[i]?.result as unknown as string,
        })) ?? []
      )
    },
    enabled: isCitizensSuccess,
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Table>
        <TableCaption>A list of all citizens.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {citizens.map((citizen) => {
            return (
              <TableRow key={citizen.id}>
                <TableCell className="font-medium">{citizen.id}</TableCell>
                <TableCell>{citizen.age}</TableCell>
                <TableCell>{citizen.city}</TableCell>
                <TableCell>{citizen.name}</TableCell>
                <TableCell className="text-right">{citizen.note}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Suspense>
  )
}
