#include "iostream"
using namespace System;
using namespace std;

class Llanta {
private:
	int x, y;
	char forma;
public:
	Llanta(int px, int py, char pforma);
	~Llanta();
	void dibujarLlanta();
	void setX(int valor);
};
//Implementar
Llanta::Llanta(int px, int py, char pforma) {
	this->x = px;
	this->y = py;
	this->forma = pforma;
}
Llanta::~Llanta() {}
void Llanta::dibujarLlanta() {
	Console::SetCursorPosition(x, y);
	cout << forma;
}
void Llanta::setX(int valor) {
	this->x = valor;
}