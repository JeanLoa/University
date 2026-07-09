#include "iostream"
using namespace System;
using namespace std;

class Chasis {
private:
	int x, y;
	char forma;
public:
	Chasis(int px, int py, char pforma);
	~Chasis();
	void dibujarChasis();
	void setX(int valor);
};
// Implementar
Chasis::Chasis(int px, int py, char pforma) {
	this->x = px;
	this->y = py;
	this->forma = pforma;
}
Chasis::~Chasis() {}
void Chasis::dibujarChasis() {
	Console::SetCursorPosition(x, y);
	cout << forma << forma << forma << forma;
}
void Chasis::setX(int valor) {
	this->x = valor;
}