# ⚡ Inicio Rápido - Deploy del Frontend

## 🎯 3 Pasos para Desplegar

### 1️⃣ Setup Inicial (Solo Primera Vez)

```bash
cd frontend
chmod +x setup-aws-frontend.sh deploy-s3.sh test-deployment.sh
./setup-aws-frontend.sh
```

### 2️⃣ Deploy

```bash
./deploy-s3.sh
```

### 3️⃣ Verificar

```bash
./test-deployment.sh
```

## ✅ ¡Listo!

Tu frontend estará disponible en:
```
http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
```

---

## 🪟 Windows (PowerShell)

```powershell
cd frontend
.\deploy-s3.ps1
```

---

## 📚 Más Información

- **Guía completa**: [frontend/DEPLOY.md](./frontend/DEPLOY.md)
- **Comandos rápidos**: [frontend/COMANDOS_RAPIDOS.md](./frontend/COMANDOS_RAPIDOS.md)
- **Windows**: [frontend/DEPLOY_WINDOWS.md](./frontend/DEPLOY_WINDOWS.md)
- **Checklist**: [CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)
- **Índice completo**: [INDICE_DOCUMENTACION.md](./INDICE_DOCUMENTACION.md)

---

## 🆘 Problemas?

```bash
# Rollback
./rollback.sh

# Ver documentación
cat frontend/DEPLOY.md

# Troubleshooting
cat CHECKLIST_DEPLOY.md
```

---

## 🎉 Estado Actual

- ✅ Backend desplegado: https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api
- 🚀 Frontend listo para deploy
- 📚 Documentación completa
- 🔧 Scripts automatizados

**Solo ejecuta los 3 comandos arriba y estarás en producción!** 🚀
