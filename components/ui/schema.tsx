"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Схема формы с проверкой имени и обязательного файла
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Название заявки должно содержать минимум 2 символа.",
  }),
  audioFile: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Загрузите файл с озвучкой.",
    }),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  // Обработчик отправки формы
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("audioFile", values.audioFile)

    try {
      const response = await fetch("/api/audio-story-reques/add", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Ошибка при отправке заявки")
      }

      console.log("Заявка успешно отправлена")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название заявки</FormLabel>
              <FormControl>
                <Input placeholder="Введите название" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audioFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Загрузите файл с озвучкой</FormLabel>
              <FormControl>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Создать заявку</Button>
      </form>
    </Form>
  )
}