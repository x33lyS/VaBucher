# VaBucher
## Problèmes rencontrés 

  - Build de l'application angular qui échouait à cause d'un conflit entre version de dépendances
  - https://blog.gabrielsagnard.fr/micro-k8s/ https://medium.com/@kanrangsan/creating-admin-user-to-access-kubernetes-dashboard-723d6c9764e4
  On a utilisé microk8s pour configurer le cluster kubernetes (voir les liens pour les fichiers de config), on arrivait à générer un token d'authentification et à acceder au dashboard du cluster mais il ne récuperait pas correctement les images sur le dockerhub donc aucun pods ne tournait.
  - Faile du build du backend en .net à cause d'une montée en version de .net6.0 -> .net7.0
  
