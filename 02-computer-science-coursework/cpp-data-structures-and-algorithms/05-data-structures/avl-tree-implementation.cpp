#include <iostream>
#include <vector>

using namespace std;

int randnum(int min, int max) { return rand() % min + (max - min + 1); }

class Nodo {
private:
	int index;
	int h;
	int data;
	Nodo* l, * r;
public:
	Nodo() {}
	Nodo(int d) : h(1), data(d), l(nullptr), r(nullptr) {}
	Nodo(int d, int i) : index(i), h(1), data(d), l(nullptr), r(nullptr) {}
	~Nodo() {}

	int getH() { return h; }
	int getDat() { return data; }
	Nodo* getL() { return l; }
	Nodo* getR() { return r; }

	void setH(int h) { this->h = h; }
	void setDat(int d) { this->data = d; }
	void setL(Nodo* l) { this->l = l; }
	void setR(Nodo* r) { this->r = r; }

	friend class Arbol;
};

class Arbol {
private:
	Nodo* raiz;
	vector<Nodo*> nodos;
public:
	Arbol() {
		raiz = nullptr;
	}
	Arbol(Nodo* raiz) : raiz(raiz) {
		nodos.push_back(raiz);
	}
	~Arbol() {}

	/*
		Funciones auxiliares
	*/
private:
	// Atributos
	int getH(Nodo* n) {
		return (n == nullptr) ? 0 : n->h;
	}
	int getBalance(Nodo* n) {
		return (n == nullptr) ? 0 : getH(n->l) - getH(n->r);
	}
	void updateH(Nodo* n) {
		if (n != nullptr) {
			n->h = 1 + max(getH(n->l), getH(n->r));
		}
	}
	int padre(int i) {
		int idx = (i + 1) / 2;
		return (i == 0) ? -1 : idx;
	}
	int hijoL(int i) {
		int idx = 2 * i + 1;
		return (idx >= nodos.size()) ? -1 : idx;
	}
	int hijoR(int i) {
		int idx = 2 * i + 1;
		return (idx >= nodos.size()) ? -1 : idx;
	}

	// Extremos
	Nodo* getMin(Nodo* nodo) {
		Nodo* nodoActual = nodo;
		while (nodoActual->l)
			nodoActual = nodoActual->l;
		return nodoActual;
	}
	Nodo* getMax(Nodo* nodo) {
		Nodo* nodoActual = nodo;
		while (nodoActual->r)
			nodoActual = nodoActual->r;
		return nodoActual;
	}

	// Rotaciones
	Nodo* rotR(Nodo* y) {
		Nodo* x = y->l;
		Nodo* T2 = x->r;

		x->r = y;
		y->l = T2;

		updateH(x);
		updateH(y);
		return x;
	}
	Nodo* rotL(Nodo* y) {
		Nodo* x = y->r;
		Nodo* T2 = x->l;

		x->l = y;
		y->r = T2;

		updateH(x);
		updateH(y);
		return x;
	}
	Nodo* rotL_R(Nodo* n) {
		n->l = rotL(n->l);
		return rotR(n);
	}
	Nodo* rotR_L(Nodo* n) {
		n->r = rotR(n->r);
		return rotL(n);
	}

	Nodo* balanceAVL(Nodo* nodo, int valor, int balance) {
		// Balanceo a cada rama
		if (balance > 1 && valor < nodo->l->data)
			return rotR(nodo);
		if (balance < -1 && valor > nodo->r->data)
			return rotL(nodo);
		if (balance > 1 && valor > nodo->l->data)
			return rotL_R(nodo);
		if (balance < -1 && valor < nodo->r->data)
			return rotR_L(nodo);
	}

public:
	void updateArbol(bool inserted) {
		if (inserted)
			nodos.resize(nodos.size() + 1);
		else
			nodos.resize(nodos.size() - 1);
		updateIndex(raiz, 0);
	}
	void updateIndex(Nodo* nodo, int idx) {
		if (!nodo) return;
		updateIndex(nodo->l, hijoL(idx));
		updateIndex(nodo->r, hijoR(idx));
		nodo->index = idx;
	}
	// Manipulacion
	Nodo* insertar(Nodo* nodo, int valor) {
		// Creamos el valor cuando el nodo esté vacío
		if (!nodo) return new Nodo(valor);

		// Vamos a la izquierda si es menor, a la derecha si es mayor, respecto del valor actual del nodo
		if (valor < nodo->data) nodo->l = insertar(nodo->l, valor); // Recurrimos a la rama izquierda
		else if (valor > nodo->data) nodo->r = insertar(nodo->r, valor); // Recurrimos a la rama derecha
		else return nodo; // No creamos nuevo nodo porque no se permiten valores idénticos

		// Para cada nodo, se actualizan las alturas
		updateH(nodo);
		int balance = getBalance(nodo);

		balanceAVL(nodo, valor, balance);

		// Retornamos el nodo respectivo a cada rama recorrida
		return nodo;
	}

	Nodo* eliminar(Nodo* nodo, int valor) {
		// Retornamos si no encontramos el valor indicado
		if (!nodo) return nodo;

		// Busqueda binaria
		if (valor < nodo->data)
			nodo->l = eliminar(nodo->l, valor);
		else if (valor > nodo->data)
			nodo->r = eliminar(nodo->r, valor);
		else {
			// Verificamos si hay alguna rama vacía
			if (!nodo->l || !nodo->r) {
				// Asignamos temp a la que contenga algo
				Nodo* temp = nodo->l ? nodo->l : nodo->r;
				// Si temp no encontro valor, eliminamos el nodo por ningún inconveniente
				if (!temp) {
					temp = nodo;
					nodo = nullptr;
				}
				// En la rama contenida, asignamos por valor
				else {
					*nodo = *temp; // Esto es igual a nodo[0] = temp[0], todo puntero es un arreglo dinamico, cuando tocamos elementos base se pierde la referencia
				}
				delete temp; // Liberamos temp
			}
			// Si las 2 ramas están llenas
			else {
				// Encontramos el minimo del nodo mayor
				Nodo* temp = getMin(nodo->r); // Nodo derecha - Nodo mayor | Nodo izquierda - Nodo menor
				nodo->data = temp->data; // Asignamos el valor del nodo a eliminar por el minimo
				nodo->r = eliminar(nodo->r, temp->data); // Eliminamos el nodo minimo
			}
		}

		// Actualizamos la altura del nodo
		updateH(nodo);

		int balance = getBalance(nodo);

		// Balanceo a cada rama
		balanceAVL(nodo, valor, balance);

		// Retornamos el nodo respectivo a cada rama recorrida
		return nodo;
	}

	Nodo* buscar(Nodo* nodo, int valor) {
		if (!nodo) return nullptr; // Retornamos si esta vacio

		if (valor < nodo->data) buscar(nodo->l, valor);
		else if (valor > nodo->data) buscar(nodo->r, valor);
		else return nodo; // Retornamos el valor buscado

		updateH(nodo);

		int balance = getBalance(nodo);

		balanceAVL(nodo, valor, balance);

		// Retornamos el nodo respectivo a cada rama recorrida
		return nodo;
	}
};

extern "C++"

int main() {
	Nodo* nodo = new Nodo(500);
	Arbol* miArbol = new Arbol;
	for (int i = 0; i < 100; ++i) {
		int data = randnum(100, 1000);
		miArbol->insertar(nodo, data);
		miArbol->updateArbol(true);
	}
	vector<int> h;
	return 0;
}
