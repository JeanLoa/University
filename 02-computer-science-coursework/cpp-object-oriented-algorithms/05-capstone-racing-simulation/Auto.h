#include "iostream"
#include "Chasis.h"
#include "Llanta.h"

class Auto {
private:
	Chasis* ObjChasis;
	Llanta* ObjLlanta;
	Llanta** arreglo;
	float x;
	float dx;
	int y;
public:
	Auto(float px, int py);
	~Auto();
	void borrar();
	void mover();
	void dibujar();
	float getX();
	float getDX();
	int getY();
};
Auto::Auto(float px, int py) {
	this->x = px;
	this->y = py;
	dx = 0.1 + (float)rand() / RAND_MAX; // Numero aleatorio entre 0.1 y 0.9

	arreglo = new Llanta * [4]; // Arreglo para almacenar 4 llantas

	// Almacenamiento de llantas
	ObjLlanta = new Llanta(x, y, 'O');
	arreglo[0] = ObjLlanta;
	ObjLlanta = new Llanta(x + 2, y, 'O');
	arreglo[1] = ObjLlanta;
	ObjLlanta = new Llanta(x, y + 2, 'O');
	arreglo[2] = ObjLlanta;
	ObjLlanta = new Llanta(x + 2, y + 2, 'O');
	arreglo[3] = ObjLlanta;

	// Instancia del objeto Chasis
	ObjChasis = new Chasis(x, y + 1, char(178));
}
Auto::~Auto() {
	// Liberamos memoria de los objetos creados en la clase
	delete ObjLlanta;
	delete ObjChasis;
	delete[] arreglo;
}
void Auto::borrar() {
	// Borrar en las coordenadas asignadas
	Console::SetCursorPosition(x, y);	  cout << "     ";
	Console::SetCursorPosition(x, y + 1); cout << "     ";
	Console::SetCursorPosition(x, y + 2); cout << "     ";
}
void Auto::mover() {
	x += dx;
	// Asignamos la posicion x a las llantas
	arreglo[0]->setX(x);
	arreglo[1]->setX(x + 2);
	arreglo[2]->setX(x);
	arreglo[3]->setX(x + 2);
	// Asignamos la posicion x al chasis
	ObjChasis->setX(x);
}
void Auto::dibujar() {
	ObjChasis->dibujarChasis();
	// Dibuja las llantas
	for (int i = 0; i < 4; i++) {
		arreglo[i]->dibujarLlanta();
	}
}
float Auto::getX() {
	return this->x;
}
float Auto::getDX() {
	return this->dx;
}
int Auto::getY() {
	return this->y;
}