#include "Auto.h"

class Carrera {
private:
	Auto** arreglo;
	Auto* ObjAuto;
public:
	Carrera();
	~Carrera();
	void IniciaCarrera();
};
Carrera::Carrera() {
	// Arreglo para almacenar Autos
	arreglo = new Auto * [8];

	// Autos para almacenar
	ObjAuto = new Auto(1, 0);
	arreglo[0] = ObjAuto;
	ObjAuto = new Auto(1, 4);
	arreglo[1] = ObjAuto;
	ObjAuto = new Auto(1, 8);
	arreglo[2] = ObjAuto;
	ObjAuto = new Auto(1, 12);
	arreglo[3] = ObjAuto;
	ObjAuto = new Auto(1, 16);
	arreglo[4] = ObjAuto;
	ObjAuto = new Auto(1, 20);
	arreglo[5] = ObjAuto;
	ObjAuto = new Auto(1, 24);
	arreglo[6] = ObjAuto;
}
Carrera::~Carrera() {
	delete ObjAuto;
	delete arreglo;
}
void Carrera::IniciaCarrera() {
	int i;
	for (i = 0; i < 7; i++) {
		arreglo[i]->dibujar();
	}
	i = 0;
	while (true) {
		arreglo[i]->borrar();
		arreglo[i]->mover();
		arreglo[i]->dibujar();
		i++;
		if (i > 6) i = 0;
		_sleep(100);
		for (int i = 0; i < 7; ++i) {
			if (arreglo[i]->getX() > 100) {
				system("cls");
				cout << "El carro " << i + 1 << " ha ganado";
				exit(0);
			}
		}
	}
}