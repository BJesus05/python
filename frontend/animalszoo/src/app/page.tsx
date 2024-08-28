'use client'

import React, { useState, useEffect } from "react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link, Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

const columns = [
  { name: "Nombre", uid: "nombre" },
  { name: "Edad", uid: "edad" },
  { name: "Grupo Animal", uid: "grupo_animal" },
  { name: "Color", uid: "color" },
  { name: "Fecha de Registro", uid: "fecha_registro" },
  { name: "Acciones", uid: "actions" } // Nueva columna para acciones
]

interface AnimalZoo {
  id:number,
  nombre: string,
  edad: string,
  grupo_animal: string,
  color: string,
  fecha_registro: string,
}

type AnimalZooKeys = keyof AnimalZoo

export default function Component() {
  const [animalZoo, setAnimalZoo] = useState<AnimalZoo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAnimalZoo = async () => {
      try {
        const response = await fetch("http://192.168.0.8:5000/animals")
        const data = await response.json()
        setAnimalZoo(data.map((item: any) => ({
          id: item._id,
          nombre: item.nombre,
          edad: item.edad.toString(),
          grupo_animal: item.grupo_animal,
          color: item.color,
          fecha_registro: new Date(item.fecha_registro).toLocaleDateString()
        })))
      } catch (err) {
        console.error("Error al obtener los datos:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnimalZoo()
  }, [])

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este animal?")) {
      try {
        const response = await fetch(`http://192.168.0.8:5000/animals/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Error al eliminar el animal')
        }

        setAnimalZoo(prev => prev.filter(animal => animal.id !== id))
        toast({
          title: "Éxito",
          description: `Animal con ID ${id} eliminado correctamente`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el animal. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/updateAnimals/${id}`)
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Zoo Animals</h1>
        <Link href="/createAnimals">
          <Button color="primary" variant="shadow">
            Crear Animal
          </Button>
        </Link>
      </div>
      <Table
        aria-label="Tabla de animales del zoo"
        className="w-full"
        isHeaderSticky
        isStriped
        style={{ backgroundColor: 'gray-900', color: 'white', borderRadius: '8px' }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn 
              key={column.uid} 
              style={{ backgroundColor: 'black', color: 'white', textAlign: 'center' }}
            >
              {column.name.toUpperCase()}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody 
          items={animalZoo}
          isLoading={isLoading}
          loadingContent={<div style={{ textAlign: 'center', color: 'white' }}>Cargando...</div>}
          emptyContent={<div style={{ textAlign: 'center', color: 'white' }}>No hay animales para mostrar.</div>}
        >
          {(item) => (
            <TableRow key={`${item.nombre}-${item.fecha_registro}`}>
              {(columnKey) => (
                columnKey === 'actions' ? (
                  <TableCell 
                    key={columnKey} 
                    style={{ textAlign: 'center', color: 'white' }}
                  >
                     <Button 
                      color="primary" 
                      size="sm" 
                      onClick={() => handleEdit(item.id)}
                      className="mr-2"
                    >
                      Editar
                    </Button>
                    <Button 
                      color="danger" 
                      size="sm" 
                      onClick={() => handleDelete(item.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                ) : (
                  <TableCell 
                    key={columnKey} 
                    style={{ textAlign: 'center', color: 'white' }}
                  >
                    {item[columnKey as AnimalZooKeys]}
                  </TableCell>
                )
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
