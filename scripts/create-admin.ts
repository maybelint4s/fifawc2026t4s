#!/usr/bin/env bun
/**
 * Script para crear el usuario administrador inicial en Supabase.
 *
 * Uso:
 *   bun scripts/create-admin.ts [EMAIL] [PASSWORD]
 *
 * Por defecto:
 *   Email: admin@admin.com
 *   Password: AdminPassword123!
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/supabase";

config();

const url = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("❌ Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const adminSupabase = createClient<Database>(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const email = process.argv[2] || "admin@admin.com";
const password = process.argv[3] || "AdminPassword123!";

async function run() {
  console.log(`▶ Creando/actualizando administrador: ${email}`);

  // 1. Check if user already exists
  const { data: existingList } = await adminSupabase.auth.admin.listUsers();
  const existing = existingList?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  let userId: string;

  if (existing) {
    userId = existing.id;
    console.log(`  ℹ️ Usuario auth ya existe (${userId}). Actualizando contraseña...`);
    const { error: updateErr } = await adminSupabase.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (updateErr) {
      console.error(`  ❌ Error actualizando usuario: ${updateErr.message}`);
      process.exit(1);
    }
  } else {
    console.log("  ℹ️ Creando usuario auth...");
    const { data, error } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: "Administrador", avatar: "🛡️" },
    });
    if (error || !data.user) {
      console.error(`  ❌ Error creando usuario: ${error?.message || "sin usuario"}`);
      process.exit(1);
    }
    userId = data.user.id;
  }

  // 2. Upsert profile with Admin role
  console.log("  ℹ️ Asegurando perfil con rol Admin...");
  const { error: profileErr } = await adminSupabase.from("profiles").upsert({
    id: userId,
    name: "Administrador",
    avatar: "🛡️",
    role: "Admin",
  });

  if (profileErr) {
    console.error(`  ❌ Error guardando perfil: ${profileErr.message}`);
    process.exit(1);
  }

  console.log(`  ✅ Administrador listo: ${email} | ${userId}`);
  console.log(`\nPuedes iniciar sesión en el panel de administrador con:`);
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
}

run();
