"use client"

import { BaseError } from "viem"
import { useContractWrite, useWaitForTransaction } from "wagmi"
import Link from "next/link"
import { stringify } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectKitButton } from "@/components/connect-kit-button"
import { citizenContractConfig } from "@/lib/contracts"

export function CreateCitizen() {
  const { write, data, error, isLoading, isError } = useContractWrite({
    ...citizenContractConfig,
    functionName: "addCitizen",
  })
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash })

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex justify-end">
        <ConnectKitButton />
      </div>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Add Citizen</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Fill out the information of the new citizen
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const age = formData.get("age") as string
          const name = formData.get("name") as string
          const city = formData.get("city") as string
          const someNote = formData.get("someNote") as string
          write({
            args: [BigInt(age), city, name, someNote],
          })
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input name="name" id="name" required placeholder="Arthur" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              name="age"
              id="age"
              required
              type="number"
              placeholder="33"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Location</Label>
            <Input name="city" id="city" required placeholder="Seattle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="someNote">Note</Label>
            <Input
              name="someNote"
              id="someNote"
              required
              placeholder="Cool Web3 dev"
            />
          </div>
          <div className="flex space-x-4">
            <Button disabled={isLoading} className="w-full" type="submit">
              Add Citizen
            </Button>
            <Link className="w-full" href="/">
              <Button className="w-full" variant="outline">
                Go Back
              </Button>
            </Link>
          </div>
        </div>
      </form>
      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
    </div>
  )
}
