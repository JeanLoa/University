#include <iostream>
#include "cctype"
#include <iomanip>

using namespace std;

int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}

char randchar() {
	int tipo = randnum(0, 1);

	if (tipo == 0) {
		return 'A' + randnum(0, 25);
	}
	else {
		return 'a' + randnum(0, 25);
	}
}

class CONTRASEÑA {
private:
	int longitud = 8;
	string contraseña;
public:
	CONTRASEÑA() : longitud(8) {
		generarContraseña();
	};
	CONTRASEÑA(int longitud) : longitud(longitud) {
		generarContraseña();
	};
	bool esSeguro(string contraseña)
	{
		int contNumeros = 0, contMayus = 0, contMinus = 0;
		for (char c : contraseña) {
			if (isdigit(c)) {
				contNumeros++;
			}
			else if (isupper(c)) {
				contMayus++;
			}
			else if (islower(c)) {
				contMinus++;
			}
		}
		if (contNumeros > 5 && contMayus > 2 && contMinus > 1) {
			return true;
		}
		else {
			return false;
		}
	}
	void generarContraseña()
	{
		contraseña.resize(longitud);

		for (int i = 0; i < longitud; ++i) {
			if (randnum(0, 10) >= 5) {
				contraseña[i] = '0' + randnum(0, 9);
			}
			else {
				contraseña[i] = randchar();
			}
		}
	}
	string getContraseña() {
		return this->contraseña;
	}
	int getLongitud() {
		return this->longitud;
	}
	void setLongitud(int longitud) {
		this->longitud = longitud;
		generarContraseña();
	}
};

int main() {
	srand(time(0));

	int n = randnum(5, 10);
	int longitud;
	string* Contraseñas = new string[n];
	bool* Validacion = new bool[n];

	for (int i = 0; i < n; ++i) {
		longitud = randnum(8, 20);
		CONTRASEÑA Contraseña(longitud);
		Contraseñas[i] = Contraseña.getContraseña();
		Validacion[i] = Contraseña.esSeguro(Contraseñas[i]);
		cout << "Contraseña " << i + 1 << ": " << setw(20) << Contraseñas[i] << "- Fuerte: ";
		if (Validacion[i] == true) {
			cout << "V";
		}
		else {
			cout << "F";
		}
		cout << "\n";
	}

	delete[] Contraseñas;
	delete[] Validacion;
	return 0;
}
