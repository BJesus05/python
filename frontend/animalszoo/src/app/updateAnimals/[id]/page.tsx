'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Link } from "@nextui-org/react"

interface AnimalData {
  id?: number
  nombre: string
  edad: number
  grupo_animal: string
  color: string
  fecha_registro: string
}

export default function AnimalCreator() {
  const [animal, setAnimal] = useState<AnimalData>({
    id: undefined,
    nombre: '',
    edad: 0,
    grupo_animal: '',
    color: '',
    fecha_registro: '',
  })
  const router = useRouter()
  const { id } = useParams()  

  useEffect(() => {
    if (id) {
      const fetchAnimal = async () => {
        try {
          const response = await fetch(`http://localhost:5000/animals/view/${id}`)
          if (!response.ok) {
            throw new Error('Error al obtener los datos del animal')
          }
          const data = await response.json()
          setAnimal(data)
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo cargar el animal. Por favor, inténtalo de nuevo.",
            variant: "destructive",
          })
        }
      }

      fetchAnimal()
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAnimal(prev => ({
      ...prev,
      [name]: name === 'edad' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    

    try {
      const response = await fetch(`http://localhost:5000/animals/${id}`, {  
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animal),
      })

      if (!response.ok) {
        throw new Error('Error al editar el animal')
      }else{
        router.push('/')  
      }

      const data = await response.json()
      toast({
        title: "Éxito",
        description: `Animal ${data.nombre} editado correctamente`,
      })

     
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo editar el animal. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Editar Animal
      </h2>

      <div className="space-y-4">
        <Label htmlFor="nombre" className="text-lg font-medium text-gray-700">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          value={animal.nombre}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="edad" className="text-lg font-medium text-gray-700">Edad</Label>
        <Input
          id="edad"
          name="edad"
          type="number"
          value={animal.edad}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="grupo_animal" className="text-lg font-medium text-gray-700">Grupo Animal</Label>
        <Input
          id="grupo_animal"
          name="grupo_animal"
          value={animal.grupo_animal}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="color" className="text-lg font-medium text-gray-700">Color</Label>
        <Input
          id="color"
          name="color"
          value={animal.color}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="fecha_registro" className="text-lg font-medium text-gray-700">Fecha Registro</Label>
        <Input
          id="fecha_registro"
          name="fecha_registro"
          type="date"
          value={animal.fecha_registro}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between">
        <Button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Guardar Cambios
        </Button>
        <Link href="/" className="w-full ml-2">
          <Button type="button" className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  )
}
