#include <iostream>

using namespace std;

int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}

class Nodo {
private:
	int data;
	Nodo* sig;
public:
	Nodo() : sig(nullptr) {}
	Nodo(int data) : sig(nullptr), data(data){}
	~Nodo(){}
	void setS_(Nodo* s_) { this->sig = s_; }
	Nodo* getS_() { return this->sig; }
	friend class Grafo;
};

class Grafo {
private:
	Nodo* raiz;
public:
	Grafo() : raiz(nullptr){}
	~Grafo() {
		Nodo* temp = raiz;
		while (temp) {
			raiz = raiz->sig;
			delete temp;
			temp = raiz;
		}
		delete raiz;
	}
	void insertar(int data) {
		if (!raiz) { raiz = new Nodo(data); }
		Nodo* temp = raiz;
		while (temp->sig) {
			temp = temp->sig;
		}
		temp->sig = new Nodo(data);
	}
	void eliminar(int data) {
		Nodo* find = raiz;
		while (find->sig && find->sig->data != data) {
			find = find->sig;
		}

		if (!find->sig || find->sig->data != data) {
			cout << "No se encontro el nodo a eliminar" << endl;
			return;
		}

		Nodo* temp1 = find;
		Nodo* temp2 = new Nodo;
		if (find->sig->sig) {
			*temp2 = Nodo(*find->sig->sig);
		}
		else {
			temp2 = nullptr;
		}
		delete find->sig;
		temp1->sig = temp2;
	}
	Nodo* buscar(int data) {
		if (!raiz) {
			cout << "No hay nodos en el grafo" << endl;
			return nullptr;
		}
		Nodo* temp = raiz;
		while (temp->sig && temp->data != data) {
			temp = temp->sig;
		}
		if (!temp->sig || temp->data != data) {
			cout << "No es encontro el nodo con el valor asociado" << endl;
			return nullptr;
		}

		return temp;
	}
	void mostrar() {
		Nodo* temp = raiz;
		int i = 1;
		while (temp->sig != nullptr) {
			cout << "Nodo " << i << ": " << temp->data << endl;
			temp = temp->sig;
			++i;
		}
	}
};

int main() {
	srand(time(0));
	Grafo* miGrafo = new Grafo;
	for (int i = 0; i < 40; ++i) {
		miGrafo->insertar(randnum(30, 70));
	}
	miGrafo->mostrar();
	miGrafo->eliminar(50);
	miGrafo->mostrar();
	miGrafo->buscar(30);
	return 0;
}
