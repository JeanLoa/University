#include <iostream>
#include <vector>

using namespace std;

// 1
void mostrarPrimos(int num) {
	if (num < 0 || num >= 1000) cout << "El numero ingresado es negativo o mayor o igual a 1000";
	if (num <= 1) cout << "No hay primos menores o iguales a 1";

	cout << "Numeros primos hasta " << num << ":" << endl;

	for (int i = 2; i < num; ++i) {
		bool esPrimo = true;
		for (int j = 2; j <= sqrt(i); ++j) {
			if (i % j == 0 && i != j) { esPrimo = false; break; }
		}
		if (esPrimo) cout << i << " ";
	}
}

// 2
void convertidor(const char* chars, int& num, int sis, string& resultado) {
	if (num > 0) {
		resultado = chars[num % sis] + resultado;
		num /= sis;
		convertidor(chars, num, sis, resultado);
	}
}

void decimal_a_sistema(int num) {
	int sis;
	cout << "Ingrese el sistema a convertir: ";
	cin >> sis;

	if (sis < 2 || sis > 16) {
		cout << "Sistema no soportado";
		return;
	}

	int original = num;

	const char* chars = "0123456789ABCDEF";
	string sistema = "", resultado = "";

	switch (sis) {
	case 2: sistema = "binario"; break;
	case 3: sistema = "ternario"; break;
	case 4: sistema = "cuaternario"; break;
	case 5: sistema = "quinario"; break;
	case 6: sistema = "senario"; break;
	case 7: sistema = "septenario"; break;
	case 8: sistema = "octal"; break;
	case 9: sistema = "nonario"; break;
	case 10: sistema = "decimal"; break;
	case 11: sistema = "undenario"; break;
	case 12: sistema = "duodecimal"; break;
	case 13: sistema = "tridecimal"; break;
	case 14: sistema = "tetradecimal"; break;
	case 15: sistema = "pentadecimal"; break;
	case 16: sistema = "hexadecimal"; break;
	}

	if (sis == 10) {
		cout << "El sistema es el mismo sistema del numero." << endl;
		return;
	}

	convertidor(chars, num, sis, resultado);

	cout << "El numero " << original << " convertido a " << sistema << " es: " << resultado << endl;
}

// 3
int sum_divisores(int i, int num) {
	static int sum = 0;
	if (i > 0) {
		if (num % i == 0) {
			sum += i;
		}
		--i;
		sum_divisores(i, num);
	}
	return sum;

}
void numero_perfecto(int num) {
	if (num < 1) cout << "El numero ingresado debe mayor o igual a 1";
	int i = num - 1;
	int sum = sum_divisores(i, num);
	if (sum == num) cout << "El numero " << num << " es perfecto";
	else cout << "El numero " << num << " no es perfecto";
}

// 4
void primosRecursivos(int i, int num, bool* primo) {
	if (i < num) {
		if (num % i == 0 && num != i) {
			*primo = false;
			return;
		}
		++i;
		primosRecursivos(i, num, primo);
	}
}
void Primo(int num) {
	bool* primo = new bool{ true };
	int i = 2;
	primosRecursivos(i, num, primo);
	if (*primo) cout << "El numero " << num << " es primo";
	else cout << "El numero " << num << " no es primo";
}

// 5
int fibonacci(int n) {
	if (n <= 1)
		return n;
	return fibonacci(n - 1) + fibonacci(n - 2);
}

void mostrarFibonacci(int cantidad) {
	cout << "Serie de Fibonacci de " << cantidad << " terminos:\n";
	for (int i = 0; i < cantidad; i++) {
		cout << fibonacci(i) << " ";
	}
	cout << endl;
}

// 5.1
int buscarFibonacci(int n, int nivel = 0) {
	static bool start = false;
	string tab(nivel * 2, ' ');
	if (!start) {
		cout << "Buscando el " << n << "-esimo termino de la serie de Fibonacci:\n";
		start = true;
	}
	if (n == 0) {
		cout << tab << "-> fibonacci(" << n << ") = 0\n";
		return 0;
	}
	if (n == 1) {
		cout << tab << "-> fibonacci(" << n << ") = 1\n";
		return 1;
	}
	
	int a = buscarFibonacci(n - 1, nivel + 1);
	int b = buscarFibonacci(n - 2, nivel + 1);
	int result = a + b;

	cout << tab << "-> fibonacci(" << n << ") = " << result << "\n";
	return result;
}

void mostrarN_Termino(int num) {
	int n_termino = buscarFibonacci(num);

	cout << endl << "El " << num << "-esimo termino de la serie de Fibonacci es: " << n_termino;
}

// 6
void mult_Dig(int num) {
	if (num < 1000) {
		cout << "El numero no tiene mas de 3 cifras";
		return;
	}
	int original = num;
	int mult = 1;
	int dig = 0;
	while (num > 0) {
		dig = num % 10;
		num /= 10;
		mult *= dig;
	}

	cout << "La multiplicacion de los digitos del numero " << original << " es: " << mult;
}


int main() {
	int num;
	cout << "Ingrese un numero: ";
	cin >> num;

	mult_Dig(num);

	return 0;
}
