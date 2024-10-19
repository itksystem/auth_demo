echo  -- ������ ���������
minikube start --nodes 3

echo -- �������� ������ worker ��� ���� ����� �������� ��� ������� �� ��� ����� � ���� �� ������ worker
kubectl label nodes minikube-m02 dedicated=worker
kubectl label nodes minikube-m03 dedicated=worker

echo -- ������ Ingress-����������
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace

echo -- ��������� ingress ����
kubectl get pods -n ingress-nginx

echo -- ������� ip ��������
minikube ip 

echo -- ��������� ���������
kubectl apply -f run.yaml

echo -- metallb ������� �������������, ����� ����������� ��������������
minikube addons enable metallb
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.9.3/manifests/namespace.yaml
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.9.3/manifests/metallb.yaml

echo  ��������� ��������
minikube dashboard

