// MVP JAUS-like inmobiliaria con IA + Chat Inteligente

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    price: ""
  });

  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("properties");
    if (stored) setProperties(JSON.parse(stored));
  }, []);

  const handleSubmit = () => {
    if (!form.title || !form.location || !form.price) return;
    const updated = [...properties, form];
    setProperties(updated);
    localStorage.setItem("properties", JSON.stringify(updated));
    setForm({ title: "", location: "", description: "", price: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const newLog = [...chatLog, { role: "user", content: chatInput }];
    setChatLog(newLog);
    setChatInput("");

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: newLog
        })
      });

      const data = await res.json();
      const reply = data.choices[0]?.message?.content;
      setChatLog((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Error en el chat", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">JAUS Inmobiliaria - MVP</h1>

      {/* Carga de propiedades */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">Cargar propiedad</h2>
          <Input
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
          />
          <Input
            name="location"
            placeholder="Ubicación"
            value={form.location}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            name="price"
            placeholder="Precio"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit}>Agregar propiedad</Button>
        </CardContent>
      </Card>

      {/* Listado de propiedades */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Propiedades cargadas</h2>
        {properties.length === 0 && <p>No hay propiedades aún.</p>}
        {properties.map((prop, idx) => (
          <Card key={idx} className="border border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">{prop.title}</h3>
              <p className="text-sm text-gray-600">{prop.location}</p>
              <p className="my-2">{prop.description}</p>
              <p className="font-semibold">${prop.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat inteligente */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">Chat inteligente</h2>
          <div className="h-48 overflow-y-auto border rounded p-2 bg-gray-50">
            {chatLog.map((msg, idx) => (
              <p key={idx} className={msg.role === "user" ? "text-right" : "text-left text-blue-700"}>
                <span className="text-sm italic">{msg.role === "user" ? "👤" : "🤖"}</span>: {msg.content}
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Escribí tu consulta"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChat()}
            />
            <Button onClick={handleChat}>Enviar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
