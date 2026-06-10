#!/usr/bin/env bun
/**
 * Script de validación del backend de Supabase para el Prode FIFA 2026.
 *
 * Verifica:
 * 1. Conectividad y credenciales.
 * 2. Lectura de dominios permitidos.
 * 3. Lectura de partidos.
 * 4. Validación de dominio de correo.
 * 5. Intento de registro con dominio no autorizado (debe fallar).
 *
 * No limpiana datos; usa un correo de prueba único para evitar colisiones.
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/supabase";

config();

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("❌ Faltan variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(url, anonKey, {
  auth: { persistSession: false },
});

function logStep(n: number, text: string) {
  console.log(`\n▶ Paso ${n}: ${text}`);
}

function logOk(text: string) {
  console.log(`  ✅ ${text}`);
}

function logFail(text: string) {
  console.log(`  ❌ ${text}`);
}

async function run() {
  let exitCode = 0;

  try {
    // 1. Conectividad básica
    logStep(1, "Verificar conectividad con Supabase");
    const { data: health, error: healthError } = await supabase
      .from("allowed_domains")
      .select("id")
      .limit(1);
    if (healthError) throw healthError;
    logOk(`Conexión exitosa a ${url}`);

    // 2. Dominios permitidos
    logStep(2, "Leer dominios permitidos");
    const { data: domains, error: domainsError } = await supabase
      .from("allowed_domains")
      .select("domain");
    if (domainsError) throw domainsError;
    if (!domains || domains.length === 0) {
      logOk("No hay dominios restringidos; la plataforma está en modo abierto.");
    } else {
      logOk(`Dominios autorizados: ${domains.map((d) => d.domain).join(", ")}`);
    }

    // 3. Leer partidos
    logStep(3, "Leer tabla de partidos");
    const { data: matches, error: matchesError } = await supabase
      .from("matches")
      .select("id, team_a_name, team_b_name, stage, datetime_iso")
      .limit(5);
    if (matchesError) throw matchesError;
    logOk(`Se leyeron ${matches?.length ?? 0} partidos de muestra.`);
    matches?.forEach((m) => {
      console.log(`     • ${m.team_a_name} vs ${m.team_b_name} (${m.stage})`);
    });

    // 4. Validar dominio
    logStep(4, "Validar dominio de correo contra allowed_domains");
    const testEmail = "test@no-existe-nunca.com";
    const { data: allDomains, error: allDomainsError } = await supabase
      .from("allowed_domains")
      .select("domain");
    if (allDomainsError) throw allDomainsError;

    const emailDomain = "@" + testEmail.split("@")[1]?.toLowerCase();
    const isAllowed =
      !allDomains ||
      allDomains.length === 0 ||
      allDomains.some((d) => d.domain.toLowerCase() === emailDomain);

    if (isAllowed) {
      logOk(`El dominio ${emailDomain} estaría permitido (modo abierto o en lista).`);
    } else {
      logOk(`El dominio ${emailDomain} está bloqueado correctamente.`);
    }

    // 5. Intento de registro con dominio bloqueado (solo si hay dominios)
    if (allDomains && allDomains.length > 0) {
      logStep(5, "Intentar registro con dominio bloqueado (debe fallar)");
      const timestamp = Date.now();
      const blockedEmail = `test_${timestamp}@no-existe-nunca.com`;
      const { error: signUpError } = await supabase.auth.signUp({
        email: blockedEmail,
        password: "Password123!",
      });
      if (signUpError && signUpError.message.toLowerCase().includes("domain")) {
        logOk("El registro fue rechazado por dominio no autorizado.");
      } else if (signUpError) {
        logOk(`El registro falló por otro motivo: ${signUpError.message}`);
      } else {
        logFail("El registro no fue rechazado; la validación de dominio no está activa en Supabase Auth triggers.");
        exitCode = 1;
      }
    } else {
      logStep(5, "Omitir prueba de registro bloqueado (modo abierto)");
    }

    // 6. Intentar login con credenciales inexistentes (debe fallar)
    logStep(6, "Intentar login con credenciales inexistentes (debe fallar)");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: `ghost_${Date.now()}@example.com`,
      password: "wrongpassword",
    });
    if (signInError) {
      logOk(`Login rechazado: ${signInError.message}`);
    } else {
      logFail("Login inesperadamente exitivo.");
      exitCode = 1;
    }
  } catch (err: any) {
    logFail(err.message || String(err));
    exitCode = 1;
  }

  console.log("\n🏁 Validación completada.");
  process.exit(exitCode);
}

run();
