#include <iostream>

using namespace std;

int Minutos_a_Segundos(float Minutos) {
	int Segundos = Minutos * 60;
	return Segundos;
}

int Horas_a_Segundos(float Horas) {
	int Segundos = Horas * 3600;
	return Segundos;
}

int main() {
	int Tiempo_en_S, Horas, Minutos, Segundos;
	cout << "Ingrese las horas: ";
	cin >> Horas;
	cout << "Ingrese los minutos: ";
	cin >> Minutos;
	cout << "Ingrese los segundos: ";
	cin >> Segundos;
	Tiempo_en_S = Horas_a_Segundos(Horas) + Minutos_a_Segundos(Minutos) + Segundos;

	cout << "El tiempo expresado en segundos es: " << Tiempo_en_S;

	return 0;
}
