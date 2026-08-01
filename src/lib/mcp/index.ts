import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listPosts from "./tools/list-posts";
import getPost from "./tools/get-post";
import createPost from "./tools/create-post";
import updatePost from "./tools/update-post";
import listResources from "./tools/list-resources";
import createResource from "./tools/create-resource";
import listSubscribers from "./tools/list-subscribers";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "caos-creative-studio",
  title: "CAOS Creative Studio",
  version: "0.1.0",
  instructions:
    "Herramientas del sitio CAOS (Gestión del Caos). Permiten listar, leer, crear y editar publicaciones del blog, gestionar recursos descargables y consultar los suscriptores del newsletter. Las acciones se ejecutan con la cuenta del usuario autenticado.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listPosts, getPost, createPost, updatePost, listResources, createResource, listSubscribers],
});
