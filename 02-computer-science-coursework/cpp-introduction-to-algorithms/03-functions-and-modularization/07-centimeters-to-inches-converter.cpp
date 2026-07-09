#include <iostream>

using namespace std;

float Cm_a_Pulgadas(float Centimetros) {
	float Pulgadas = Centimetros * 2.54;
	return Pulgadas;
}

int main() {
	int Cm;
	cout << "Ingrese cantidad en cm: ";
	cin >> Cm;
	float Pulgadas = Cm_a_Pulgadas(Cm);
	cout << "Los "<< Cm << " cm son: " << Pulgadas << " pulgadas";

	return 0;
}
