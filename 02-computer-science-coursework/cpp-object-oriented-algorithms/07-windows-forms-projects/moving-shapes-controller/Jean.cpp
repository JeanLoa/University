#include "MyForm.h"
using namespace System::Windows::Forms;

void main() {
	srand(time(0));
	Application::Run(gcnew Jean::MyForm);
}
