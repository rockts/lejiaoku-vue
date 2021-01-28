export interface CategoryProps {
  id: number;
  name: string;
  cover?: string;
  alias: string;
}

export interface ResourcesProps {
  id: number;
  title: string;
  content: string;
  cover?: string;
  createdAt: string;
  categoryId: number;
}

export const testData: CategoryProps[] = [
  {
    id: 1,
    name: '教材',
    alias: 'textbook',
    cover: require('@/assets/catagory.png'),
  },
  {
    id: 2,
    name: '课件',
    alias: 'coursewarel',
    cover: require('@/assets/catagory.png'),
  },
  {
    id: 3,
    name: '教案',
    alias: 'essonplan',
    cover: require('@/assets/catagory.png'),
  },
  {
    id: 4,
    name: '同步练习',
    alias: 'questions',
    cover: require('@/assets/catagory.png'),
  },

  {
    id: 5,
    name: '其他资源',
    alias: 'other',
    cover: require('@/assets/catagory.png'),
  },
  {
    id: 6,
    name: '视频',
    alias: 'video',
    cover: require('@/assets/catagory.png'),
  },
];

export const testResources: ResourcesProps[] = [
  {
    id: 1,
    title: 'What is Test Data in Software Testing?',
    content:
      'Test Data in Software Testing is the input given to a software program during test execution. It represents data that affects or affected by software execution while testing. Test data is used for both positive testing to verify that functions produce expected results for given inputs and for negative testing to test software ability to handle unusual, exceptional or unexpected inputs.',
    cover: require('@/assets/catagory.png'),
    createdAt: '2020-06-03 10:34:22',
    categoryId: 1,
  },
  {
    id: 2,
    title: 'est Data Generation: What is, How to, Example, Tools',
    content:
      'As a tester, you may think that ‘Designing Test cases is challenging enough, then why bother about something as trivial as Test Data’. The purpose of this tutorial is to introduce you to Test Data, its importance and give practical tips and tricks to generate test data quickly. So,',
    cover: require('@/assets/catagory.png'),
    createdAt: '2020-06-03 10:34:22',
    categoryId: 1,
  },
  {
    id: 3,
    title: 'Test Data for White Box Testing',
    content:
      'Typically sample data should be generated before you begin test execution because it is difficult to handle test data management otherwise. Since in many testing environments creating test data takes multiple pre-steps or very time-consuming test environment configurations. . Also If test data generation is done while you are in test execution phase you may exceed your testing deadline.',
    cover: require('@/assets/catagory.png'),
    createdAt: '2020-06-03 10:34:22',
    categoryId: 2,
  },
  {
    id: 4,
    title: 'Test Data for Performance Testing',
    content:
      'Performance Testing is the type of testing which is performed in order to determine how fast system responds under a particular workload. The goal of this type of testing is not to find bugs, but to eliminate bottlenecks.  An important aspect of Performance Testing is that the set of sample data used must be very close to  orction. The following question arises:  to test with real data, but how do I obtain this data?’ The answer is pretty straightforward: from the people who know the best – the customers. They may be able to provide some data they already have or, if they don’t have an existing set of data, they may help you by giving feedback regarding how the real-world data might look like. In case you are in a maintenance testing project you could copy data from the production environment into the testing bed. It is a good practice to anonymize (scramble) sensitive customer data like Social Security Numb',
    cover: require('@/assets/catagory.png'),
    createdAt: '2020-06-03 10:34:22',
    categoryId: 1,
  },
  {
    id: 5,
    title: 'Automated Test Data Generation Tools',
    content:
      'n order to generate various sets of data, you can use a gamut of automated test data generation tools. Below are some examples of such tools:',
    cover: require('@/assets/catagory.png'),
    createdAt: '2020-06-03 10:34:22',
    categoryId: 3,
  },
  {
    id: 6,
    title: 'Conclusion',
    content:
      'In conclusion, well-designed testing data allows you to identify and correct serious flaws in functionality. Choice of test data selected must be reevaluated in every phase of a multi-phase product development cycle. So, always keep an eye o',
    cover: require('@/assets/catagory.png'),
    createdAt: '2020-06-03 10:34:22',
    categoryId: 2,
  },
];
