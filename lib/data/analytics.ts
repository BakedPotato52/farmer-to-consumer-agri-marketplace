import type {
  PlatformStats,
  SalesSummary,
  FarmerProfile,
  User,
  Product,
} from "@/lib/types";
import { getAllFarmers, getFarmerById } from "./farmers";
import { getAllUsers } from "./users";
import { getAllOrders } from "./orders";
import { getAllProducts } from "./products";

export async function getPlatformStats(): Promise<PlatformStats> {
  const farmers = await getAllFarmers();
  const users = await getAllUsers();
  const orders = await getAllOrders();

  const totalFarmers = farmers.length;
  const verifiedFarmers = farmers.filter((f) => f.isVerified).length;
  const totalConsumers = users.filter((u) => u.role === "consumer").length;
  const totalOrders = orders.length;

  const completedOrders = orders.filter((o) => o.status === "delivered");
  const totalRevenue = completedOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0,
  );

  const pendingApprovals = farmers.filter((f) => !f.isVerified).length;

  const orderFulfilmentRate =
    totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0;
  const averageOrderValue =
    completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  const consumerOrderCounts = orders.reduce(
    (acc, order) => {
      acc[order.consumerId] = (acc[order.consumerId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const repeatCustomers = Object.values(consumerOrderCounts).filter(
    (count) => count > 1,
  ).length;
  const uniqueCustomers = Object.keys(consumerOrderCounts).length;
  const repeatCustomerRate =
    uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

  return {
    totalFarmers,
    verifiedFarmers,
    totalConsumers,
    totalOrders,
    totalRevenue,
    pendingApprovals,
    orderFulfilmentRate,
    averageOrderValue,
    repeatCustomerRate,
  };
}

export async function getOrderTrends(): Promise<
  {
    month: string;
    orders: number;
    revenue: number;
  }[]
> {
  const orders = await getAllOrders();
  const trendsMap: Record<string, { orders: number; revenue: number }> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!trendsMap[monthYear]) {
      trendsMap[monthYear] = { orders: 0, revenue: 0 };
    }

    trendsMap[monthYear].orders += 1;
    if (order.status === "delivered") {
      trendsMap[monthYear].revenue += order.totalAmount;
    }
  });

  return Object.keys(trendsMap)
    .sort()
    .map((month) => ({
      month,
      orders: trendsMap[month].orders,
      revenue: trendsMap[month].revenue,
    }));
}

export async function getTopFarmers(
  limit: number = 5,
): Promise<
  {
    farmer: FarmerProfile & { user: User };
    revenue: number;
    orders: number;
  }[]
> {
  const orders = await getAllOrders();
  const farmerStats: Record<string, { revenue: number; orders: number }> = {};

  orders.forEach((order) => {
    if (!farmerStats[order.farmerId]) {
      farmerStats[order.farmerId] = { revenue: 0, orders: 0 };
    }
    farmerStats[order.farmerId].orders += 1;
    if (order.status === "delivered") {
      farmerStats[order.farmerId].revenue += order.totalAmount;
    }
  });

  const farmerIds = Object.keys(farmerStats).sort(
    (a, b) => farmerStats[b].revenue - farmerStats[a].revenue,
  ).slice(0, limit);

  const farmerList = await Promise.all(farmerIds.map((id) => getFarmerById(id)));

  return farmerList
    .map((farmer, idx) => {
      if (!farmer) return null;
      const fId = farmerIds[idx];
      return {
        farmer,
        revenue: farmerStats[fId].revenue,
        orders: farmerStats[fId].orders,
      };
    })
    .filter(Boolean) as {
    farmer: FarmerProfile & { user: User };
    revenue: number;
    orders: number;
  }[];
}

export async function getTopProducts(
  limit: number = 5,
): Promise<{ product: Product; orders: number; revenue: number }[]> {
  const orders = await getAllOrders();
  const products = await getAllProducts();
  const productStats: Record<string, { orders: number; revenue: number }> = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productStats[item.productId]) {
        productStats[item.productId] = { orders: 0, revenue: 0 };
      }
      productStats[item.productId].orders += 1;
      if (order.status === "delivered") {
        productStats[item.productId].revenue += item.totalPrice;
      }
    });
  });

  const sortedProducts = Object.keys(productStats)
    .sort((a, b) => productStats[b].revenue - productStats[a].revenue)
    .slice(0, limit)
    .map((productId) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return null;
      return {
        product,
        revenue: productStats[productId].revenue,
        orders: productStats[productId].orders,
      };
    })
    .filter(Boolean) as { product: Product; orders: number; revenue: number }[];

  return sortedProducts;
}

export async function getCategoryDistribution(): Promise<
  {
    category: string;
    count: number;
    revenue: number;
  }[]
> {
  const products = await getAllProducts();
  const orders = await getAllOrders();
  const distribution: Record<string, { count: number; revenue: number }> = {};

  products.forEach((product) => {
    if (!distribution[product.category]) {
      distribution[product.category] = { count: 0, revenue: 0 };
    }
    distribution[product.category].count += 1;
  });

  orders.forEach((order) => {
    if (order.status === "delivered") {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          if (!distribution[product.category]) {
            distribution[product.category] = { count: 0, revenue: 0 };
          }
          distribution[product.category].revenue += item.totalPrice;
        }
      });
    }
  });

  return Object.keys(distribution).map((category) => ({
    category,
    count: distribution[category].count,
    revenue: distribution[category].revenue,
  }));
}

export async function getFarmerSalesSummary(farmerId: string): Promise<SalesSummary> {
  const allOrders = await getAllOrders();
  const farmerOrders = allOrders.filter((o) => o.farmerId === farmerId);
  const totalOrders = farmerOrders.length;
  const completedOrders = farmerOrders.filter(
    (o) => o.status === "delivered",
  ).length;
  const pendingOrders = farmerOrders.filter(
    (o) => o.status === "pending" || o.status === "confirmed",
  ).length;

  const totalRevenue = farmerOrders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const averageOrderValue =
    completedOrders > 0 ? totalRevenue / completedOrders : 0;

  const productStats: Record<
    string,
    { name: string; revenue: number; orders: number }
  > = {};

  farmerOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productStats[item.productId]) {
        productStats[item.productId] = {
          name: item.productName,
          revenue: 0,
          orders: 0,
        };
      }
      productStats[item.productId].orders += 1;
      if (order.status === "delivered") {
        productStats[item.productId].revenue += item.totalPrice;
      }
    });
  });

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    completedOrders,
    pendingOrders,
    averageOrderValue,
    topProducts,
  };
}
