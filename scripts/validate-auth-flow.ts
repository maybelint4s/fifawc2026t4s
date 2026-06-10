#!/usr/bin/env bun
/**
 * Script de validación del flujo completo de autenticación y quiniela.
 *
 * 1. Crea un usuario de prueba (vía service role).
 * 2. Inicia sesión.
 * 3. Crea el perfil (como lo hace services/auth.ts tras signUp).
 * 4. Guarda una predicción.
 * 5. Limpia el usuario de prueba.
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/supabase";

config();

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  console.error("❌ Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error("❌ Se requiere SUPABASE_SERVICE_ROLE_KEY para este script.");
  process.exit(1);
}

const supabase = createClient<Database>(url, anonKey, {
  auth: { persistSession: false },
});

const adminSupabase = createClient<Database>(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const timestamp = Date.now();
const testEmail = `prode.test.${timestamp}@testmail.com`;
const testPassword = "TestPassword123!";
let createdUserId: string | null = null;

function logStep(n: number, text: string) {
  console.log(`\n▶ Paso ${n}: ${text}`);
}
function logOk(text: string) {
  console.log(`  ✅ ${text}`);
}
function logWarn(text: string) {
  console.log(`  ⚠️ ${text}`);
}
function logFail(text: string) {
  console.log(`  ❌ ${text}`);
}

async function cleanup() {
  if (!createdUserId) return;
  try {
    await adminSupabase.from("predictions").delete().eq("user_id", createdUserId);
    await adminSupabase.from("profiles").delete().eq("id", createdUserId);
    await adminSupabase.auth.admin.deleteUser(createdUserId);
    logOk(`Usuario de prueba ${testEmail} eliminado.`);
  } catch (err: any) {
    logWarn(`No se pudo limpiar el usuario de prueba: ${err.message}`);
  }
}

async function run() {
  let exitCode = 0;

  try {
    // 1. Create user via admin API
    logStep(1, `Crear usuario de prueba vía admin API: ${testEmail}`);
    const { data: createData, error: createError } = await adminSupabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { name: "Usuario de Prueba", avatar: "🧪" },
    });

    if (createError || !createData.user) {
      logFail(`Creación fallida: ${createError?.message || "sin usuario"}`);
      exitCode = 1;
      return;
    }

    createdUserId = createData.user.id;
    logOk(`Usuario creado con ID ${createdUserId}`);

    // 2. Sign in (so inserts run under RLS as the authenticated user)
    logStep(2, "Iniciar sesión con el usuario de prueba");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError || !signInData.session) {
      logFail(`Login fallido: ${signInError?.message || "sin sesión"}`);
      exitCode = 1;
      return;
    }

    logOk("Inicio de sesión exitoso. Token recibido.");

    supabase.auth.setSession({
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    });

    // 3. Create profile
    logStep(3, "Crear perfil asociado");
    const { error: profileInsertError } = await supabase.from("profiles").insert({
      id: createdUserId,
      name: "Usuario de Prueba",
      avatar: "🧪",
      role: "Employee",
    });
    if (profileInsertError) {
      logFail(`Error creando perfil: ${profileInsertError.message}`);
      exitCode = 1;
      return;
    }
    logOk("Perfil creado correctamente.");

    // 4. Check profile
    logStep(4, "Verificar perfil");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, role")
      .eq("id", createdUserId)
      .single();

    if (profileError || !profile) {
      logFail(`Perfil no encontrado: ${profileError?.message}`);
      exitCode = 1;
      return;
    }

    logOk(`Perfil: ${profile.name} | Rol: ${profile.role}`);

    // 5. Save a prediction
    logStep(5, "Guardar predicción de prueba");
    const { data: match } = await supabase
      .from("matches")
      .select("id, score_a, score_b")
      .eq("stage", "FG")
      .limit(1)
      .single();

    if (!match) {
      logFail("No hay partidos de fase de grupos para predecir.");
      exitCode = 1;
      return;
    }

    const originalScoreA = match.score_a;

    const { data: prediction, error: predError } = await supabase
      .from("predictions")
      .upsert(
        {
          match_id: match.id,
          user_id: createdUserId,
          predicted_score_a: 2,
          predicted_score_b: 1,
        },
        { onConflict: "match_id,user_id" }
      )
      .select()
      .single();

    if (predError) {
      logFail(`Error guardando predicción: ${predError.message}`);
      exitCode = 1;
      return;
    }

    logOk(`Predicción guardada: ${prediction.predicted_score_a}-${prediction.predicted_score_b} para el partido ${match.id}`);

    // 6. Verify admin-only write is blocked for non-admin
    logStep(6, "Verificar que un usuario normal no puede editar partidos");
    const { data: beforeMatch } = await adminSupabase
      .from("matches")
      .select("score_a, score_b")
      .eq("id", match.id)
      .single();

    const { data: updateData, error: matchUpdateError } = await supabase
      .from("matches")
      .update({ score_a: 99, score_b: 99 })
      .eq("id", match.id)
      .select();

    const { data: afterMatch } = await adminSupabase
      .from("matches")
      .select("score_a, score_b")
      .eq("id", match.id)
      .single();

    const valuesUnchanged =
      afterMatch?.score_a === beforeMatch?.score_a &&
      afterMatch?.score_b === beforeMatch?.score_b;

    if (matchUpdateError || !updateData || updateData.length === 0 || valuesUnchanged) {
      logOk("Escritura en matches bloqueada por RLS (sin filas actualizadas).");
    } else {
      logFail("¡Un usuario normal pudo editar un partido! Revisar políticas RLS.");
      exitCode = 1;
      // Restore original values
      await adminSupabase
        .from("matches")
        .update({ score_a: beforeMatch?.score_a, score_b: beforeMatch?.score_b })
        .eq("id", match.id);
    }

    // 7. Verify admin-only domain insert is blocked for non-admin
    logStep(7, "Verificar que un usuario normal no puede agregar dominios");
    const { error: domainInsertError } = await supabase
      .from("allowed_domains")
      .insert({ domain: "@evil.com" });

    if (domainInsertError) {
      logOk(`Escritura en allowed_domains bloqueada por RLS: ${domainInsertError.message}`);
    } else {
      logFail("¡Un usuario normal pudo agregar un dominio! Revisar políticas RLS.");
      exitCode = 1;
      await adminSupabase.from("allowed_domains").delete().eq("domain", "@evil.com");
    }

    // 8. Admin existence check
    logStep(8, "Verificar existencia del usuario administrador");
    const { data: adminProfile, error: adminProfileError } = await adminSupabase
      .from("profiles")
      .select("id, name, role")
      .eq("role", "Admin")
      .limit(1)
      .maybeSingle();

    if (adminProfileError || !adminProfile) {
      logWarn("No se encontró un perfil con rol Admin en la base de datos.");
      logWarn("Para probar el panel de administrador, crea un usuario con rol Admin.");
    } else {
      logOk(`Admin encontrado: ${adminProfile.name} (${adminProfile.id})`);
    }
  } catch (err: any) {
    logFail(err.message || String(err));
    exitCode = 1;
  } finally {
    await cleanup();
  }

  console.log("\n🏁 Validación del flujo completada.");
  process.exit(exitCode);
}

run();
