#include <iostream>

using namespace std;

int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}

struct S {
	int x;
	int y;
	S(int x, int y) {
		this->x = x;
		this->y = y;
	}
	S() {
		this->x = 0;
		this->y = 0;
	}
	S(const S& s) {
		this->x = s.x;
		this->y = s.y;
	}
	S& operator=(const S& s) {
		if (this != &s) {
			this->x = s.x;
			this->y = s.y;
		}
		return *this;
	}

};

ostream& operator<<(ostream& os, const S& s1) {
	os << "(" << s1.x << ", " << s1.y << ")" << endl;
	return os;
}

template <typename T>
class Nodo;
template <typename S>
class Cola;
template <typename S>
class Pila;

template <typename T>
class Nodo {
private:
	T data;
	Nodo* next;
public:
	Nodo(T data) {
		this->data = data;
		this->next = nullptr;
	}
	friend class Cola<T>;
	friend class Pila<T>;
};

template<typename T>
class Cola {
private:
	Nodo<T>* head;
	Nodo<T>* tail;
public:
	Cola() {
		head = nullptr;
		tail = nullptr;
	}
	void push_back(T data) {
		Nodo<T>* newNode = new Nodo<T>(data);
		if (!head) {
			head = tail = newNode;
		}
		else if (head && tail && head == tail) {
			head->next = newNode;
			tail = head->next;
		}
		else {
			tail->next = newNode;
			tail = tail->next;
		}
	}
	void pop() {
		if (!head) {
			throw runtime_error("Queue is empty");
		}
		Nodo<T>* temp = head;
		head = head->next;
		delete temp;
	}
	T front() {
		if (!head) {
			throw runtime_error("Queue is empty");
		}
		return head->data;
	}
	void show() {
		Nodo<T>* temp = head;
		int i = 0;
		while (temp) {
			cout << "Node " << i << ": " << temp->data;
			temp = temp->next;
			++i;
		}
	}
	bool empty() {
		return !head;
	}
	bool full() {
		return head;
	}
};

template<typename T>
class Pila {
private:
	Nodo<T> head;
public:
	Pila() {
		head = nullptr;
	}
	void push(T data) {
		Nodo<T>* newNode = new Nodo<T>(data);
		if (!head) {
			head = newNode;
			return;
		}
		newNode->next = head;
		head = newNode;
	}
	void pop() {
		if (!head) {
			throw runtime_error("Queue empty");
		}
		Nodo<S>* temp = head;
		head = head->next;
		delete temp;
	}
	S front() {
		if (!head) {
			throw runtime_error("Queue empty");
		}
		return head->data;
	}
	void show() {
		Nodo<T>* temp;
		int i = 0;
		while (temp) {
			cout << "Node " << i << ": " << temp->data;
			temp = temp->sig;
			++i;
		}
	}
	bool empty() {
		return !head;
	}
	bool full() {
		return head;
	}
};

int main() {
	Cola<S>* miCola = new Cola<S>;

	for (int i = 0; i < 20; ++i) {
		miCola->push_back(S(randnum(1, 20), randnum(1, 20)));
	}

	miCola->show();
	system("pause>0");
	system("cls");

	Pila<S>* miPila = new Pila<S>;

	for (int i = 0; i < 20; ++i) {
		miPila->push(S(randnum(1, 20), randnum(1, 20)));
	}

	miPila->show();
	system("pause>0");
	system("cls");

	return 0;
}
