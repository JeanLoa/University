#include <iostream>

using namespace std;

int main() {
	int num;
	int m5, m2, m1;
	cout << "Ingrese la cantidad a desglosar: ";
	cin >> num;
	m5 = num / 5;
	m2 = num % 5 / 2;
	m1 = num % 5 % 2 / 1;
	cout << "\nLas monedas de 5 soles: " << m5;
	cout << "\nLas monedas de 2 soles: " << m2;
	cout << "\nLas monedas de 1 sol: " << m1;

	return 0;
}
