import { mount } from '@vue/test-utils';
import Logout from '@/components/Logout.vue';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/stores/user';

vi.mock('vue-router');
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(),
}));

describe('Logout.vue', () => {
  let router;
  let localStorageSpy;
  let userStore;

  beforeEach(() => {
    router = {
      push: vi.fn(),
      currentRoute: { value: { path: '/chat' } },
    };

    localStorageSpy = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    global.localStorage = localStorageSpy;

    userStore = {
      clearUser: vi.fn(),
    };

    useUserStore.mockReturnValue(userStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call clearUser on logout', async () => {
    const wrapper = mount(Logout, {
      global: {
        plugins: [createTestingPinia()],
        mocks: {
          $router: router,
        },
      },
    });

    await wrapper.find('button').trigger('click');

    expect(userStore.clearUser).toHaveBeenCalled();
  });

  it('should remove authToken from localStorage', async () => {
    const wrapper = mount(Logout, {
      global: {
        plugins: [createTestingPinia()],
        mocks: {
          $router: router,
        },
      },
    });

    await wrapper.find('button').trigger('click');

    expect(localStorageSpy.removeItem).toHaveBeenCalledWith('authToken');
  });

  it("should redirect to '/' on logout", async () => {
    const wrapper = mount(Logout, {
      global: {
        plugins: [createTestingPinia()],
        mocks: {
          $router: router,
        },
      },
    });

    await wrapper.find('button').trigger('click');

    expect(router.push).toHaveBeenCalledWith('/');
  });
});
