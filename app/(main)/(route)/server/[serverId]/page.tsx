"use client"
import { useParams } from "next/navigation"


const ServerPage = () => {
  const serverId = useParams()
  return (
    <div>${serverId.serverId}</div>
  )
}

export default ServerPage