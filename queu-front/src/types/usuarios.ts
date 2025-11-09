export default interface Usuario {
  id: number
  name: string
  email: string
  document: string
  phone: string
  type: CitizenType
  createdAt: string
  updatedAt?: string
}


export enum CitizenType
{
    Normal = 0,
    Priority = 1,
    Vip = 2
}
