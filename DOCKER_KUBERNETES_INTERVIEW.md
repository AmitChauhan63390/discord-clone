# Docker & Kubernetes Interview Questions and Answers
## Deep Explanation Guide

---

# PART 1: DOCKER

---

## 1. What is Docker and why is it used?

**Answer:**

Docker is an open-source platform that uses OS-level virtualization to package applications and their dependencies into portable units called **containers**.

### How Docker Works Internally

```
Traditional Deployment:           Docker Deployment:
┌─────────────────────┐          ┌─────────────────────────────────┐
│      App A          │          │  Container A  │  Container B     │
│  (needs Python 2.7) │          │  ┌─────────┐  │  ┌───────────┐  │
│      App B          │          │  │ App A   │  │  │  App B    │  │
│  (needs Python 3.9) │          │  │Python2.7│  │  │ Python3.9 │  │
│   → CONFLICT!       │          │  └─────────┘  │  └───────────┘  │
└─────────────────────┘          └─────────────────────────────────┘
                                          Docker Engine
                                          Host OS Kernel
```

### Key Benefits
- **Portability**: "Works on my machine" → works everywhere
- **Isolation**: Each container has its own filesystem, network, and process space
- **Efficiency**: Shares the host OS kernel (unlike VMs)
- **Reproducibility**: Same image always produces the same container

---

## 2. Docker vs Virtual Machines — What's the Difference?

**Answer:**

```
Virtual Machine Architecture:         Docker Architecture:
┌──────────┬──────────┐              ┌──────────┬──────────┐
│  App A   │  App B   │              │  App A   │  App B   │
├──────────┼──────────┤              ├──────────┼──────────┤
│  Guest   │  Guest   │              │  Libs/   │  Libs/   │
│   OS A   │   OS B   │              │  Bins A  │  Bins B  │
├──────────┴──────────┤              ├──────────┴──────────┤
│    Hypervisor       │              │    Docker Engine     │
├─────────────────────┤              ├─────────────────────┤
│    Host OS          │              │    Host OS           │
├─────────────────────┤              ├─────────────────────┤
│    Hardware         │              │    Hardware          │
└─────────────────────┘              └─────────────────────┘
Size: GBs, Boot: minutes             Size: MBs, Boot: seconds
```

| Feature         | Virtual Machine     | Docker Container     |
|----------------|---------------------|----------------------|
| OS              | Full Guest OS       | Shares Host Kernel   |
| Size            | GBs                 | MBs                  |
| Startup Time    | Minutes             | Seconds              |
| Isolation       | Hardware-level      | Process-level        |
| Performance     | Near bare-metal     | Native               |
| Portability     | Heavy               | Lightweight          |

**Deep Explanation:** VMs virtualize hardware using a hypervisor (VMware, VirtualBox), so each VM includes a full OS. Docker uses **namespaces** and **cgroups** in the Linux kernel to isolate processes — no separate OS kernel per container.

---

## 3. What are Docker Images and Containers?

**Answer:**

### Docker Image
A **read-only template** containing:
- Application code
- Runtime environment
- Libraries and dependencies
- Configuration files
- Dockerfile instructions baked in

Think of it as a **class** in OOP.

### Docker Container
A **running instance** of an image. Think of it as an **object** instantiated from a class.

```
Dockerfile → (docker build) → Image → (docker run) → Container
                                  ↗
               docker pull from registry
```

### Layered Architecture
```
┌─────────────────────────────┐  ← Writable Container Layer
├─────────────────────────────┤  ← COPY . . (your app code)
├─────────────────────────────┤  ← RUN pip install requirements
├─────────────────────────────┤  ← COPY requirements.txt .
├─────────────────────────────┤  ← WORKDIR /app
└─────────────────────────────┘  ← FROM python:3.9 (base image)
```

Each instruction in a Dockerfile creates a **new layer**. Layers are cached and shared between images to save disk space.

---

## 4. Explain Dockerfile and its common instructions

**Answer:**

A Dockerfile is a text file with instructions to build a Docker image.

```dockerfile
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (layer caching optimization)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
```

### Key Instructions Explained

| Instruction | Purpose | Example |
|------------|---------|---------|
| `FROM`     | Base image | `FROM ubuntu:22.04` |
| `RUN`      | Execute command during build | `RUN apt-get update` |
| `COPY`     | Copy files from host | `COPY ./src /app/src` |
| `ADD`      | Like COPY but supports URLs and tar extraction | `ADD archive.tar.gz /app` |
| `ENV`      | Set environment variable | `ENV PORT=8080` |
| `EXPOSE`   | Document which port container listens on | `EXPOSE 8080` |
| `CMD`      | Default command (overridable) | `CMD ["npm", "start"]` |
| `ENTRYPOINT` | Main command (not easily overridable) | `ENTRYPOINT ["python"]` |
| `VOLUME`   | Mount point for persistent data | `VOLUME ["/data"]` |
| `ARG`      | Build-time variable | `ARG VERSION=1.0` |
| `USER`     | Set user for subsequent instructions | `USER appuser` |
| `HEALTHCHECK` | How to test container health | `HEALTHCHECK CMD curl -f http://localhost/` |

### CMD vs ENTRYPOINT

```dockerfile
# CMD - can be overridden completely
CMD ["python", "app.py"]
# docker run myimage bash → runs bash, ignores CMD

# ENTRYPOINT - always runs, CMD becomes arguments
ENTRYPOINT ["python"]
CMD ["app.py"]
# docker run myimage other.py → runs "python other.py"
```

---

## 5. What is Docker Compose?

**Answer:**

Docker Compose is a tool for defining and running **multi-container** Docker applications using a YAML file.

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Web application
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./src:/app/src  # Development hot-reload
    networks:
      - app-network

  # Database
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # Cache
  redis:
    image: redis:7-alpine
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

```bash
docker-compose up -d        # Start all services in background
docker-compose down         # Stop and remove containers
docker-compose logs -f web  # Stream logs from web service
docker-compose exec db psql # Open psql in db container
```

---

## 6. What are Docker Volumes and Bind Mounts?

**Answer:**

Containers are **ephemeral** — data is lost when they stop. Volumes solve this.

### Types of Storage

```
┌─────────────────────────────────────────┐
│              Container                   │
│  ┌──────────────────────────────────┐   │
│  │  Writable Layer (lost on stop)   │   │
│  └──────────────────────────────────┘   │
│         ↑              ↑                │
│    Bind Mount       Named Volume        │
└─────────┼──────────────┼───────────────┘
          │              │
    /host/path    Docker-managed
    (host FS)     /var/lib/docker/volumes/
```

### Named Volumes (Recommended for Production)
```bash
docker volume create mydata
docker run -v mydata:/app/data myimage
```

### Bind Mounts (Development)
```bash
docker run -v /host/path:/container/path myimage
```

### tmpfs Mounts (In-memory, non-persistent)
```bash
docker run --tmpfs /tmp myimage
```

| Feature          | Named Volume     | Bind Mount       |
|-----------------|------------------|------------------|
| Managed by      | Docker           | User             |
| Host path       | Docker chooses   | User specifies   |
| Portability     | High             | Low              |
| Use case        | Production data  | Development      |

---

## 7. Explain Docker Networking

**Answer:**

Docker provides several network drivers to control how containers communicate.

### Network Types

```
Bridge Network (default):
┌──────────────────────────────────────┐
│  Container A    Container B           │
│  172.17.0.2     172.17.0.3           │
│       │              │               │
│  ─────┴──────────────┴─────          │
│         docker0 bridge               │
│              │                       │
│         172.17.0.1 (host)           │
└──────────────────────────────────────┘
```

```bash
# List networks
docker network ls

# Create custom network
docker network create --driver bridge mynet

# Connect containers
docker run --network mynet --name web myapp
docker run --network mynet --name db postgres

# Containers on same network can reach each other by name
# web container can do: ping db
```

### Network Drivers

| Driver    | Use Case                              |
|----------|---------------------------------------|
| `bridge` | Default, isolated container groups    |
| `host`   | Container shares host's network stack |
| `none`   | No networking                         |
| `overlay`| Multi-host (Docker Swarm/Kubernetes)  |
| `macvlan`| Assign MAC address, appear on LAN    |

### Port Mapping
```bash
# Map host:container
docker run -p 8080:3000 myapp
#               ↑      ↑
#           host port  container port
```

---

## 8. What are Docker Layers and how does caching work?

**Answer:**

Each Dockerfile instruction creates an **immutable layer**. Docker caches layers and reuses them if nothing changed upstream.

```dockerfile
# BAD: Cache busted every time code changes
FROM node:18
COPY . .              # If ANY file changes → cache miss
RUN npm install       # Re-runs every time!

# GOOD: Separate dependency installation
FROM node:18
COPY package*.json ./ # Only changes when dependencies change
RUN npm install       # Cached unless package.json changes!
COPY . .              # Code changes don't bust npm install cache
```

### Cache Invalidation Rules
- If a layer changes, **all subsequent layers** are rebuilt
- `COPY`/`ADD` checks file checksums, not timestamps
- `RUN` commands are cached based on the exact string

---

## 9. What is a Multi-Stage Build?

**Answer:**

Multi-stage builds allow you to use multiple `FROM` statements to create a **lean final image** without build tools.

```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production (only runtime, no build tools)
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**Result:** Final image is tiny — no source code, no dev dependencies, no build tools.

```
Without multi-stage:  ~1.2GB (includes all build tools)
With multi-stage:     ~150MB (only runtime)
```

---

## 10. Docker Security Best Practices

**Answer:**

### 1. Run as Non-Root User
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### 2. Use Minimal Base Images
```dockerfile
# Prefer minimal images
FROM alpine:3.18          # ~5MB
FROM node:18-alpine       # Much smaller than node:18
FROM scratch              # Empty — for static binaries
```

### 3. Scan for Vulnerabilities
```bash
docker scout cves myimage
trivy image myimage
```

### 4. Read-only Filesystem
```bash
docker run --read-only myimage
```

### 5. Limit Resources
```bash
docker run --memory="256m" --cpus="0.5" myimage
```

### 6. Never Store Secrets in Images
```bash
# BAD
ENV DB_PASSWORD=secret123

# GOOD — Pass at runtime
docker run -e DB_PASSWORD=$SECRET myimage
# Or use Docker secrets (Swarm) / Kubernetes Secrets
```

---

## 11. Docker Registry — Docker Hub vs Private Registry

**Answer:**

A **registry** stores Docker images. Docker Hub is the public default.

```bash
# Pull from Docker Hub
docker pull nginx:latest

# Tag and push to Docker Hub
docker tag myapp:1.0 username/myapp:1.0
docker push username/myapp:1.0

# Private registry (e.g., ECR, GCR, Harbor)
docker tag myapp:1.0 my-registry.example.com/myapp:1.0
docker push my-registry.example.com/myapp:1.0
```

### Private Registries
| Registry | Provider    |
|---------|-------------|
| ECR     | AWS         |
| GCR/AR  | Google      |
| ACR     | Azure       |
| Harbor  | Self-hosted |
| Nexus   | Self-hosted |

---

## 12. What is Docker Swarm?

**Answer:**

Docker Swarm is Docker's native **container orchestration** tool for managing a cluster of Docker hosts.

```bash
# Initialize swarm
docker swarm init --advertise-addr <manager-ip>

# Add worker node (run on worker)
docker swarm join --token <token> <manager-ip>:2377

# Deploy a service (replicated across nodes)
docker service create --name web --replicas 3 -p 80:80 nginx

# Scale service
docker service scale web=5
```

> **Note:** Docker Swarm is simpler but less powerful than Kubernetes. Most production environments use Kubernetes today.

---

# PART 2: KUBERNETES

---

## 13. What is Kubernetes and why do we need it?

**Answer:**

Kubernetes (K8s) is an open-source **container orchestration platform** that automates deployment, scaling, and management of containerized applications.

### Why Kubernetes?

```
Problem with just Docker:
- Container crashes → no automatic restart
- Traffic spikes → can't auto-scale
- Updates → manual, causes downtime
- Multiple hosts → no load balancing

Kubernetes solves all of this:
✓ Self-healing (restarts failed containers)
✓ Auto-scaling (HPA, VPA, KEDA)
✓ Rolling updates with zero downtime
✓ Service discovery and load balancing
✓ Secret and config management
✓ Storage orchestration
```

---

## 14. Kubernetes Architecture — Control Plane and Worker Nodes

**Answer:**

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTROL PLANE (Master)                    │
│                                                             │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │ API Server   │  │Scheduler │  │ Controller Manager    │ │
│  │(kube-apiserver)│ │          │  │ - Node Controller     │ │
│  │              │  │          │  │ - Replication Ctrl    │ │
│  └──────────────┘  └──────────┘  │ - Endpoints Ctrl      │ │
│         │                        └───────────────────────┘ │
│  ┌──────┴───────────────────────────────────┐              │
│  │                  etcd                    │              │
│  │        (Distributed key-value store)     │              │
│  └──────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Worker 1   │  │  Worker 2   │  │  Worker 3   │
│             │  │             │  │             │
│  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │
│  │kubelet│  │  │  │kubelet│  │  │  │kubelet│  │
│  └───────┘  │  │  └───────┘  │  │  └───────┘  │
│  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │
│  │kube-  │  │  │  │kube-  │  │  │  │kube-  │  │
│  │proxy  │  │  │  │proxy  │  │  │  │proxy  │  │
│  └───────┘  │  │  └───────┘  │  │  └───────┘  │
│  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │
│  │Pods   │  │  │  │Pods   │  │  │  │Pods   │  │
│  └───────┘  │  │  └───────┘  │  │  └───────┘  │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Control Plane Components

| Component              | Role |
|-----------------------|------|
| **kube-apiserver**    | Front-end for the K8s control plane. All communication goes through it. |
| **etcd**              | Distributed key-value store. Source of truth for cluster state. |
| **kube-scheduler**    | Assigns Pods to nodes based on resources, affinity rules, etc. |
| **controller-manager**| Runs controllers that watch cluster state and reconcile to desired state. |
| **cloud-controller**  | Integrates with cloud provider APIs (load balancers, storage, nodes). |

### Worker Node Components

| Component       | Role |
|----------------|------|
| **kubelet**    | Agent on each node. Ensures containers in Pods are running and healthy. |
| **kube-proxy** | Maintains network rules on nodes for Service communication. |
| **Container Runtime** | Runs containers (containerd, CRI-O, Docker). |

---

## 15. What is a Pod?

**Answer:**

A **Pod** is the smallest deployable unit in Kubernetes. It wraps one or more containers that share:
- Network namespace (same IP)
- Storage volumes
- IPC namespace

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: myapp
spec:
  containers:
    - name: main-container
      image: nginx:1.25
      ports:
        - containerPort: 80
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
      livenessProbe:
        httpGet:
          path: /healthz
          port: 80
        initialDelaySeconds: 3
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /ready
          port: 80
```

### Single vs Multi-Container Pods
```
Single Container Pod (most common):
┌───────────────┐
│  ┌─────────┐  │
│  │  nginx  │  │ Pod IP: 10.0.0.1
│  └─────────┘  │
└───────────────┘

Sidecar Pattern (multi-container):
┌────────────────────────────┐
│  ┌──────────┐ ┌─────────┐  │
│  │  nginx   │ │ log-    │  │ Pod IP: 10.0.0.2
│  │          │ │ shipper │  │ Shared filesystem
│  └──────────┘ └─────────┘  │
└────────────────────────────┘
```

---

## 16. What is a Deployment?

**Answer:**

A **Deployment** manages a set of identical Pods (ReplicaSet) and handles rolling updates.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max extra pods during update
      maxUnavailable: 0  # No downtime
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myapp:2.0
          ports:
            - containerPort: 3000
```

```bash
# Create deployment
kubectl apply -f deployment.yaml

# Check status
kubectl rollout status deployment/my-deployment

# Update image (triggers rolling update)
kubectl set image deployment/my-deployment myapp=myapp:3.0

# Rollback to previous version
kubectl rollout undo deployment/my-deployment

# Rollback to specific revision
kubectl rollout undo deployment/my-deployment --to-revision=2

# View rollout history
kubectl rollout history deployment/my-deployment
```

### Deployment → ReplicaSet → Pod Hierarchy
```
Deployment (my-deployment)
  └── ReplicaSet (my-deployment-7d4f8b6c9)
        ├── Pod (my-deployment-7d4f8b6c9-abc12)
        ├── Pod (my-deployment-7d4f8b6c9-def34)
        └── Pod (my-deployment-7d4f8b6c9-ghi56)
```

---

## 17. What are Kubernetes Services?

**Answer:**

Pods are ephemeral and get new IPs when restarted. A **Service** provides a stable endpoint to access a group of Pods.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: myapp          # Routes to pods with this label
  ports:
    - protocol: TCP
      port: 80          # Service port
      targetPort: 3000  # Container port
  type: ClusterIP       # Default
```

### Service Types

```
ClusterIP (default):
  Internal cluster IP only
  ┌────────────────────────────────┐
  │ Cluster                        │
  │  [Client Pod] → [Service IP]   │
  │                → [Pod 1]       │
  │                → [Pod 2]       │
  └────────────────────────────────┘

NodePort:
  Exposes service on each Node's IP + static port (30000-32767)
  [External] → NodeIP:30080 → [Service] → [Pods]

LoadBalancer:
  Provisions cloud load balancer (AWS ELB, GCP LB, Azure LB)
  [Internet] → [Cloud LB] → [Nodes] → [Service] → [Pods]

ExternalName:
  Maps service to external DNS name
  [Pod] → my-svc → db.external.com
```

---

## 18. What is an Ingress?

**Answer:**

**Ingress** manages external HTTP/HTTPS access to services, providing:
- Host/path-based routing
- TLS termination
- Name-based virtual hosting

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
    - hosts:
        - myapp.example.com
      secretName: tls-secret
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
```

```
Internet → Ingress Controller (nginx/traefik) → Service → Pods
                     ↑
            Routes based on host/path
```

---

## 19. ConfigMaps and Secrets

**Answer:**

### ConfigMap — Non-sensitive configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "db.example.com"
  DATABASE_PORT: "5432"
  app.properties: |
    max_connections=100
    log_level=info
```

### Secret — Sensitive data (base64 encoded)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  DB_PASSWORD: c2VjcmV0MTIz   # base64: secret123
  API_KEY: bXlhcGlrZXk=       # base64: myapikey
```

```bash
# Create secret from command line
kubectl create secret generic app-secrets \
  --from-literal=DB_PASSWORD=secret123 \
  --from-file=ssh-privatekey=~/.ssh/id_rsa
```

### Using in Pods
```yaml
spec:
  containers:
    - name: myapp
      # Method 1: Environment variables
      envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
      # Method 2: Volume mount
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: app-config
```

> **Security Note:** K8s Secrets are base64-encoded, not encrypted by default. Use Sealed Secrets, Vault, or enable etcd encryption at rest.

---

## 20. Namespaces

**Answer:**

**Namespaces** provide logical isolation within a cluster.

```bash
# List namespaces
kubectl get namespaces
# default, kube-system, kube-public, kube-node-lease

# Create namespace
kubectl create namespace production

# Deploy to namespace
kubectl apply -f deployment.yaml -n production

# Get resources in namespace
kubectl get pods -n production

# Get resources across all namespaces
kubectl get pods --all-namespaces
```

### Typical Namespace Strategy
```
cluster
├── kube-system       (K8s system components)
├── monitoring        (Prometheus, Grafana)
├── ingress-nginx     (Ingress controller)
├── development       (Dev workloads)
├── staging           (Staging workloads)
└── production        (Production workloads)
```

### Resource Quotas per Namespace
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: production-quota
  namespace: production
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    pods: "50"
```

---

## 21. Horizontal Pod Autoscaler (HPA)

**Answer:**

HPA automatically scales Pods based on CPU/memory or custom metrics.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-deployment
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70   # Scale when CPU > 70%
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

```bash
# Create HPA imperatively
kubectl autoscale deployment my-deployment \
  --cpu-percent=70 --min=2 --max=20

# Monitor HPA
kubectl get hpa -w
```

### HPA Scaling Algorithm
```
Desired Replicas = ceil(currentReplicas × (currentMetricValue / desiredMetricValue))

Example:
Current: 4 pods, CPU at 100%, target is 70%
Desired = ceil(4 × (100/70)) = ceil(5.71) = 6 pods
```

---

## 22. Persistent Volumes (PV) and Persistent Volume Claims (PVC)

**Answer:**

```
PersistentVolume (PV):
  Cluster-level storage resource provisioned by admin
  
PersistentVolumeClaim (PVC):
  User's request for storage (size, access mode)

StorageClass:
  Template for dynamic provisioning
```

```yaml
# StorageClass (dynamic provisioning)
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer

---
# PVC
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  storageClassName: fast-ssd
  accessModes:
    - ReadWriteOnce   # RWO: single node read/write
  resources:
    requests:
      storage: 10Gi

---
# Pod using PVC
spec:
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: my-pvc
  containers:
    - name: myapp
      volumeMounts:
        - mountPath: "/data"
          name: data
```

### Access Modes
| Mode | Short | Description |
|------|-------|-------------|
| ReadWriteOnce | RWO | One node, read+write |
| ReadOnlyMany  | ROX | Many nodes, read-only |
| ReadWriteMany | RWX | Many nodes, read+write |

---

## 23. StatefulSet vs Deployment

**Answer:**

| Feature          | Deployment            | StatefulSet              |
|-----------------|----------------------|--------------------------|
| Pod identity     | Random names         | Stable: pod-0, pod-1     |
| Storage          | Shared or ephemeral  | Each pod gets its own PVC|
| Startup order    | Parallel             | Sequential (pod-0 first) |
| Use case         | Stateless apps       | Databases, Kafka, Zookeeper |

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres-headless  # Headless service required
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:          # Each pod gets its own PVC
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

Pods get stable DNS: `postgres-0.postgres-headless.default.svc.cluster.local`

---

## 24. DaemonSet

**Answer:**

**DaemonSet** ensures one pod runs on **every node** (or a subset). Perfect for:
- Log collectors (Fluentd, Filebeat)
- Monitoring agents (node-exporter)
- Network plugins (Calico, Weave)

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      tolerations:
        - key: node-role.kubernetes.io/control-plane
          effect: NoSchedule    # Run on master nodes too
      containers:
        - name: node-exporter
          image: prom/node-exporter:latest
          ports:
            - containerPort: 9100
```

---

## 25. Resource Requests and Limits

**Answer:**

```yaml
resources:
  requests:          # Minimum guaranteed resources (used for scheduling)
    memory: "128Mi"  # Scheduler finds nodes with ≥128Mi available
    cpu: "250m"      # 250 millicores = 0.25 CPU core
  limits:            # Maximum allowed (enforced at runtime)
    memory: "256Mi"  # OOMKilled if exceeded
    cpu: "500m"      # Throttled if exceeded (not killed)
```

### CPU Units
```
1 CPU = 1000m (millicores)
0.5 CPU = 500m
0.25 CPU = 250m
```

### QoS Classes (affects eviction order under resource pressure)
```
Guaranteed:  requests == limits (best, evicted last)
Burstable:   requests < limits
BestEffort:  no requests or limits (worst, evicted first)
```

---

## 26. Taints and Tolerations

**Answer:**

**Taints** repel pods from nodes. **Tolerations** allow pods to schedule on tainted nodes.

```bash
# Add taint to node (only GPU workloads)
kubectl taint nodes gpu-node gpu=true:NoSchedule

# NoSchedule: Won't schedule new pods
# PreferNoSchedule: Try to avoid (soft)
# NoExecute: Evict existing pods too
```

```yaml
# Pod with toleration for GPU node
spec:
  tolerations:
    - key: "gpu"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
```

### vs Node Affinity
- **Taints/Tolerations**: Node repels pods unless pod tolerates it
- **Node Affinity**: Pod attracts itself to specific nodes

```yaml
# Node Affinity — Pod prefers nodes with SSD
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: disktype
                operator: In
                values:
                  - ssd
```

---

## 27. Probes — Liveness, Readiness, Startup

**Answer:**

```yaml
spec:
  containers:
    - name: myapp
      # Startup Probe — checked first during container start
      # Disables liveness/readiness until this passes
      startupProbe:
        httpGet:
          path: /health
          port: 8080
        failureThreshold: 30   # 30 × 10s = 5 minutes for slow startup
        periodSeconds: 10

      # Liveness Probe — is the container alive?
      # Failure → container is restarted
      livenessProbe:
        httpGet:
          path: /healthz
          port: 8080
        initialDelaySeconds: 10
        periodSeconds: 10
        failureThreshold: 3

      # Readiness Probe — is the container ready to serve traffic?
      # Failure → pod removed from Service endpoints (no restart)
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        periodSeconds: 5
        failureThreshold: 3
```

### Probe Types
```yaml
# HTTP GET
httpGet:
  path: /health
  port: 8080

# TCP Socket
tcpSocket:
  port: 5432

# Execute command
exec:
  command: ["pg_isready", "-U", "postgres"]
```

---

## 28. RBAC — Role-Based Access Control

**Answer:**

RBAC controls who can do what in the cluster.

```
ServiceAccount → RoleBinding → Role
                      ↓
               ClusterRoleBinding → ClusterRole
```

```yaml
# Role (namespace-scoped)
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: default
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]

---
# RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
  - kind: ServiceAccount
    name: my-service-account
    namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io

---
# ServiceAccount
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  namespace: default
```

### ClusterRole vs Role
| Resource       | Scope        |
|---------------|--------------|
| Role           | Namespace    |
| ClusterRole    | Cluster-wide |
| RoleBinding    | Namespace    |
| ClusterRoleBinding | Cluster-wide |

---

## 29. Network Policies

**Answer:**

By default, all pods can communicate with all pods. **NetworkPolicy** restricts this.

```yaml
# Allow only frontend to talk to backend
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: backend      # This policy applies to backend pods
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend   # Only frontend can reach backend
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: database   # Backend can only reach database
      ports:
        - protocol: TCP
          port: 5432
```

> Requires a CNI plugin that supports NetworkPolicy (Calico, Cilium, Weave).

---

## 30. Helm — Kubernetes Package Manager

**Answer:**

**Helm** is the package manager for Kubernetes. A **Chart** is a package of pre-configured K8s resources.

```bash
# Install a chart
helm install my-nginx bitnami/nginx

# Install with custom values
helm install my-app ./my-chart \
  --set image.tag=2.0 \
  --set replicas=3 \
  -f custom-values.yaml

# Upgrade a release
helm upgrade my-app ./my-chart --set image.tag=3.0

# Rollback
helm rollback my-app 1

# List releases
helm list

# Uninstall
helm uninstall my-app
```

### Chart Structure
```
my-chart/
├── Chart.yaml          # Metadata
├── values.yaml         # Default configuration values
├── templates/
│   ├── deployment.yaml # Templated manifests
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl    # Template helpers
└── charts/             # Dependency charts
```

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-app
spec:
  replicas: {{ .Values.replicas }}
  template:
    spec:
      containers:
        - image: {{ .Values.image.repository }}:{{ .Values.image.tag }}
```

---

## 31. kubectl Common Commands Cheat Sheet

**Answer:**

```bash
# --- Cluster Info ---
kubectl cluster-info
kubectl get nodes -o wide

# --- Pods ---
kubectl get pods -A                     # All namespaces
kubectl describe pod my-pod             # Detailed info
kubectl logs my-pod -c container-name   # Logs
kubectl logs my-pod --previous          # Previous container logs
kubectl exec -it my-pod -- /bin/bash    # Shell into pod
kubectl port-forward pod/my-pod 8080:80 # Port forwarding
kubectl delete pod my-pod

# --- Deployments ---
kubectl get deployments
kubectl scale deployment my-app --replicas=5
kubectl rollout status deployment/my-app
kubectl rollout undo deployment/my-app

# --- Services ---
kubectl get svc
kubectl expose deployment my-app --port=80 --type=LoadBalancer

# --- Apply/Delete ---
kubectl apply -f manifest.yaml
kubectl delete -f manifest.yaml
kubectl apply -k ./kustomize-dir        # Kustomize

# --- Debugging ---
kubectl describe node my-node
kubectl top nodes                       # Resource usage
kubectl top pods
kubectl get events --sort-by=.metadata.creationTimestamp

# --- Context/Namespace ---
kubectl config get-contexts
kubectl config use-context my-cluster
kubectl config set-context --current --namespace=production
```

---

## 32. Kubernetes Scheduling Deep Dive

**Answer:**

The Scheduler selects which node a Pod runs on.

### Scheduling Process
```
New Pod (Pending)
     ↓
Filter Phase (Predicates):
  - NodeResourcesFit     (enough CPU/memory?)
  - NodeAffinity         (affinity rules match?)
  - TaintToleration      (tolerates all taints?)
  - PodTopologySpread    (spread constraints met?)
  - VolumeBinding        (PVC can bind on this node?)
     ↓
Score Phase (Priorities):
  - LeastAllocated       (prefer less-used nodes)
  - BalancedAllocation   (balance CPU/memory ratio)
  - ImageLocality        (prefer nodes with image pulled)
     ↓
Bind to highest-scoring node
```

### Pod Topology Spread Constraints
```yaml
# Spread pods across zones
topologySpreadConstraints:
  - maxSkew: 1               # Max difference between zones
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: myapp
```

---

## 33. Init Containers

**Answer:**

**Init containers** run to completion before app containers start. Use for setup tasks.

```yaml
spec:
  initContainers:
    - name: wait-for-db
      image: busybox
      command: ['sh', '-c',
        'until nc -z db-service 5432; do echo waiting for db; sleep 2; done']
    
    - name: run-migrations
      image: myapp:latest
      command: ['python', 'manage.py', 'migrate']
      env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
  
  containers:
    - name: myapp
      image: myapp:latest
```

Init containers run **sequentially** and must succeed before the next starts.

---

## 34. Jobs and CronJobs

**Answer:**

### Job — Run to completion
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: batch-processor
spec:
  completions: 5       # Run 5 times total
  parallelism: 2       # 2 pods running at once
  backoffLimit: 3      # Retry failed pods up to 3 times
  template:
    spec:
      restartPolicy: Never   # Required for Jobs
      containers:
        - name: processor
          image: myprocessor:latest
          command: ["python", "process.py"]
```

### CronJob — Scheduled Job
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-backup
spec:
  schedule: "0 2 * * *"    # 2 AM every day (cron syntax)
  concurrencyPolicy: Forbid  # Don't run if previous still running
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: backup
              image: mybackup:latest
              command: ["./backup.sh"]
```

---

## 35. Kubernetes Security — Pod Security Standards

**Answer:**

### Pod Security Standards (replacing deprecated PodSecurityPolicy)
```
Privileged:  No restrictions (for system components)
Baseline:    Minimal restrictions (prevents known privilege escalations)
Restricted:  Heavily restricted (security best practices)
```

```yaml
# Apply to namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### Secure Pod Spec
```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: myapp
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
```

---

## 36. Service Mesh — Istio/Linkerd

**Answer:**

A **service mesh** adds infrastructure layer for service-to-service communication.

```
Without Service Mesh:
Pod A → Pod B (unencrypted, no retry logic, no metrics)

With Service Mesh (sidecar proxy pattern):
Pod A
  └── [Envoy Sidecar] → [Envoy Sidecar] → Pod B
         ↓                      ↓
    [Control Plane] ←→ [Control Plane]
     (Istiod/Linkerd)
```

### Istio Features
```yaml
# Traffic management
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-service
spec:
  hosts:
    - my-service
  http:
    - match:
        - headers:
            user-type:
              exact: premium
      route:
        - destination:
            host: my-service
            subset: v2        # Route premium users to v2
    - route:
        - destination:
            host: my-service
            subset: v1        # Others to v1
          weight: 90
        - destination:
            host: my-service
            subset: v2
          weight: 10          # 10% canary
```

### Service Mesh Benefits
- **mTLS**: Automatic mutual TLS between services
- **Observability**: Metrics, traces, logs out of the box
- **Traffic control**: Canary, A/B, circuit breaking, retries
- **Security policies**: Fine-grained access control

---

## 37. Kubernetes Monitoring and Observability

**Answer:**

### Monitoring Stack (Kube-Prometheus)
```
Prometheus    → Scrapes metrics from pods/nodes/K8s components
Grafana       → Visualizes metrics
AlertManager  → Sends alerts (PagerDuty, Slack, email)
```

```yaml
# Expose metrics from your app
# Pod annotation for Prometheus scraping
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"
```

### Logging Stack (EFK/ELK)
```
Pods → Fluentd/Filebeat (DaemonSet) → Elasticsearch → Kibana
```

### Distributed Tracing
```
App → OpenTelemetry SDK → Jaeger/Tempo → Grafana
```

### Key Metrics to Monitor
```
Cluster level:
  - Node CPU/Memory usage
  - Pod eviction count
  - API server request latency

Application level:
  - Request rate (RPS)
  - Error rate
  - Response latency (P99, P95, P50) ← "RED" Method
  - Resource utilization ← "USE" Method
```

---

## 38. GitOps with ArgoCD / Flux

**Answer:**

**GitOps** = Git is the single source of truth. Any change to cluster state goes through Git.

```
Developer → Git Push → Git Repo ← ArgoCD watches ← Kubernetes Cluster
                           ↓
                      ArgoCD detects diff
                           ↓
                      Syncs cluster to match Git
```

```yaml
# ArgoCD Application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/my-k8s-manifests
    targetRevision: HEAD
    path: environments/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true        # Remove resources deleted from Git
      selfHeal: true     # Revert manual changes to cluster
```

---

## 39. Kubernetes Operators

**Answer:**

An **Operator** is a custom controller that extends Kubernetes to manage complex stateful applications using **Custom Resource Definitions (CRDs)**.

```
Standard K8s: Manages Deployments, Services, etc.
Operator:     Manages "PostgreSQL", "Kafka", "Elasticsearch" as K8s-native resources
```

```yaml
# CRD defines new resource type
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: postgresclusters.postgres.example.com
spec:
  group: postgres.example.com
  names:
    kind: PostgresCluster
    plural: postgresclusters
  scope: Namespaced
  versions:
    - name: v1
      served: true
      storage: true

---
# Using the custom resource
apiVersion: postgres.example.com/v1
kind: PostgresCluster
metadata:
  name: my-postgres
spec:
  instances: 3
  postgresVersion: 15
  backupSchedule: "0 1 * * *"
  storageSize: 100Gi
```

The Operator watches these CRs and reconciles the actual state (creates Pods, Services, PVCs, runs backups, handles failover).

---

## 40. Common Kubernetes Troubleshooting

**Answer:**

### Pod Stuck in Pending
```bash
kubectl describe pod my-pod
# Common reasons:
# - Insufficient resources on nodes
# - PVC not bound
# - Node selector/affinity not matching
# - Taint not tolerated
```

### Pod CrashLoopBackOff
```bash
kubectl logs my-pod --previous    # Previous container logs
kubectl describe pod my-pod       # Look at Events section
# Common reasons:
# - Application error on startup
# - Wrong command/args
# - Missing environment variables
# - Liveness probe failing too soon
```

### ImagePullBackOff
```bash
# Common reasons:
# - Image doesn't exist
# - Wrong tag
# - Private registry needs imagePullSecret
kubectl create secret docker-registry regcred \
  --docker-server=my-registry.com \
  --docker-username=user \
  --docker-password=pass
```

### Service Not Reachable
```bash
# Check endpoints (are pods selected?)
kubectl get endpoints my-service

# Check labels match
kubectl get pods --show-labels
kubectl describe service my-service  # Check selector

# Test DNS resolution
kubectl run -it --rm debug --image=busybox -- nslookup my-service
```

### OOMKilled
```bash
kubectl describe pod my-pod
# Look for: Reason: OOMKilled
# Fix: Increase memory limits or find memory leak
```

---

## Quick Reference: Docker vs Kubernetes Terminology

| Docker Concept       | Kubernetes Equivalent         |
|---------------------|-------------------------------|
| `docker run`         | Pod                          |
| `docker-compose`     | Deployment + Service         |
| `docker service`     | Deployment (Swarm → K8s)     |
| `.env` file          | ConfigMap + Secret           |
| `docker network`     | Service + NetworkPolicy      |
| `docker volume`      | PersistentVolume + PVC       |
| `docker ps`          | `kubectl get pods`           |
| `docker logs`        | `kubectl logs`               |
| `docker exec -it`    | `kubectl exec -it`           |
| `docker pull/push`   | Same (registry concept same) |
| Health check         | Liveness/Readiness Probe     |

---

*Last updated: 2026 | Covers Docker Engine, Docker Compose, Kubernetes 1.29+*
