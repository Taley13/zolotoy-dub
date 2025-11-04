export type KitchenWork = {
  id: string;
  filename: string;
  title: string;
  description: string;
  style: string;
  price?: string;
};

export const kitchenWorks: KitchenWork[] = [
  {
    id: '1',
    filename: 'kitchen-01.jpg',
    title: 'Классическая кухня из массива дуба',
    description: 'Элегантная кухня в классическом стиле с резными фасадами и патиной',
    style: 'Классика',
    price: 'от 450 000 ₽'
  },
  {
    id: '2',
    filename: 'kitchen-02.jpg',
    title: 'Угловая кухня в тёмных тонах',
    description: 'Современная угловая кухня с глянцевыми фасадами и встроенной техникой',
    style: 'Модерн',
    price: 'от 380 000 ₽'
  },
  {
    id: '3',
    filename: 'kitchen-03.jpg',
    title: 'Светлая кухня с островом',
    description: 'Просторная кухня в светлых тонах с функциональным островом',
    style: 'Современный',
    price: 'от 520 000 ₽'
  },
  {
    id: '4',
    filename: 'kitchen-04.jpg',
    title: 'Кухня-гостиная в стиле лофт',
    description: 'Открытая планировка с индустриальными элементами и барной стойкой',
    style: 'Лофт',
    price: 'от 480 000 ₽'
  },
  {
    id: '5',
    filename: 'kitchen-05.jpg',
    title: 'Компактная П-образная кухня',
    description: 'Эргономичная кухня с максимальным использованием пространства',
    style: 'Минимализм',
    price: 'от 320 000 ₽'
  },
  {
    id: '6',
    filename: 'kitchen-06.jpg',
    title: 'Кухня с золотой фурнитурой',
    description: 'Роскошная кухня с элементами декора под золото и мрамором',
    style: 'Неоклассика',
    price: 'от 580 000 ₽'
  },
  {
    id: '7',
    filename: 'kitchen-07.jpg',
    title: 'Линейная кухня для студии',
    description: 'Компактное решение с встроенной бытовой техникой',
    style: 'Скандинавский',
    price: 'от 280 000 ₽'
  },
  {
    id: '8',
    filename: 'kitchen-08.jpg',
    title: 'Кухня с винным шкафом',
    description: 'Премиальная кухня со встроенным винным холодильником',
    style: 'Премиум',
    price: 'от 650 000 ₽'
  },
  {
    id: '9',
    filename: 'kitchen-09.jpg',
    title: 'Двухцветная кухня',
    description: 'Контрастное сочетание светлых и тёмных фасадов',
    style: 'Контемпорари',
    price: 'от 420 000 ₽'
  },
  {
    id: '10',
    filename: 'kitchen-10.jpg',
    title: 'Кухня с высокими шкафами',
    description: 'Максимальная вместительность с системами хранения до потолка',
    style: 'Функциональный',
    price: 'от 390 000 ₽'
  },
  {
    id: '11',
    filename: 'kitchen-11.jpg',
    title: 'Кухня с деревянной столешницей',
    description: 'Натуральное дерево в сочетании с современными материалами',
    style: 'Эко',
    price: 'от 460 000 ₽'
  },
  {
    id: '12',
    filename: 'kitchen-12.jpg',
    title: 'Кухня в тёплых тонах',
    description: 'Уютная кухня с акцентом на натуральные материалы',
    style: 'Кантри',
    price: 'от 410 000 ₽'
  }
];

