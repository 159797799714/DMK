module.exports = [
	'Customer/GetVerificationCode', // 获取手机验证码
	'Customer/CreateToken',      // 手机号登录
	'Customer/WeixinToken',  			// 如果使用CreateToken接口登录，出现 微信用户未绑定 = 1003 则使用此接口绑定微信
	'Customer/CreateCustomerPaw',// 创建密码
	'Home/GetDistanceStore',     // 首页获取离本地最近的一个店铺信息
	'Home/GetSystemSet',         // 首页-获取用户系统配置Banners、最大距离限制、广告词
	'Goods/GetGoods',            // 菜单-根据定位，获取离定位最近店铺的 手机app商品
	'Home/GetHomeFirstCategories',// 首页获取一级分类
	'Goods/GetGoodsFirstCategories',// 菜单-获取所有 一级分类
	'Home/GetHomeGoods',          // 首页-获取全品
	'Home/GetHomeNewGoods',       // 首页新品
	'Home/GetHomeDiscountGoods',  // 首页折扣
	'Home/GetHomeGroupGoods',     // 首页团购商品
	'Home/GetHomeRecommendGoods', // 首页推荐
	'Home/GetHomeExplosiveGoods', // 爆款
	'Home/GetHomeTimeoutDiscountGoods',// 限时抢购商品
	'Home/GetHomeFreeGoods',				 // 首页，付款页面，购物车免费商品
	
	'Home/SearchGoods',                     // 产品搜索
	// 'Goods/GetGoodsDetail', // 根据商品商品编号获取详情
	'Recipes/GetRecipes',        // 食神食谱列表
	'Recipes/GetRecipesDetail',  // 获取食谱详细
	'GroupOrder/GetEffectiveGroupOrder',// 获取团购
	'Goods/AppQueryGoods',       // 商品搜索
	'Recipes/QueryRecipes',      // 食谱----搜索食谱
	'GroupOrder/SearchGroupOrder',        // 团购-搜索团购产品
]