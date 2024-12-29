"use client"
import { useState, useEffect } from "react";
import db from '../../app/src/firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

export default function FirebaseConfigChecker() {
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        const snapshot = await db.ref().once('value');
        if (snapshot.exists()) {
          setConnectionStatus("Conexão bem-sucedida! Dados encontrados.");
        } else {
          setConnectionStatus("Conexão bem-sucedida! A coleção está vazia.");
        }
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setConnectionStatus((prev) => prev + " | Usuário autenticado.");
          } else {
            setConnectionStatus((prev) => prev + " | Nenhum usuário autenticado.");
          }
        });
      } catch (error: unknown) {
        console.error(error);
        setConnectionStatus(`Erro de conexão: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    checkFirebaseConnection();
  }, []); // Executa apenas uma vez

  return (
    <div>
      <h3>{connectionStatus || "Verificando conexão com Firebase..."}</h3>
    </div>
  );
}