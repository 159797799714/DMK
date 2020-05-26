module.exports= {
	
	GetVerificationCode: 'Customer/GetVerificationCode',   // 获取手机验证码
	CreateToken: 'Customer/CreateToken',                   // 手机号登录
	WeixinToken: 'Customer/WeixinToken',  								 // 如果使用CreateToken接口登录，出现 微信用户未绑定 = 1003 则使用此接口绑定微信
	CreateCustomerPaw: 'Customer/CreateCustomerPaw',       // 创建密码
	AppQueryGoods: 'Home/SearchGoods',                     // 产品搜索
	
	// 首页
	
	GetCategoriesFirst: 'Home/GetHomeFirstCategories',     // 获取首页菜单一级分类
	GetHomeGoods: 'Home/GetHomeGoods',                     //  首页全品接口
	GetHomeNewGoods: 'Home/GetHomeNewGoods',               //  首页新品接口
	GetHomeDiscountGoods: 'Home/GetHomeDiscountGoods',     //  首页折扣商品
	GetHomeGroupGoods: 'Home/GetHomeGroupGoods',           //  首页团购的商品
	GetHomeExplosiveGoods: 'Home/GetHomeExplosiveGoods',   //  首页爆款商品
	GetHomeRecommendGoods: 'Home/GetHomeRecommendGoods',   // 首页推荐的商品
	GetSystemSet: 'Home/GetSystemSet',                     // 首页-获取用户系统配置Banners、最大距离限制、广告词
	GetNearbyShop: 'Home/GetNearbyShop',                   // 首页-获取所有附近店铺 根据客户端ip(如果用户授权位置信息传经纬度，拿到的是附近的店铺列表，如果不传则是拿到最近的一个门店)
	GetBuyingGoods: 'Home/GetHomeTimeoutDiscountGoods',    // 获取首页限时抢购
	GetFreeGoods: 'Home/GetHomeFreeGoods',                 // 获取首页，付款页面，购物车免费商品
	GetStoreGoods: 'Goods/GetGoods',                       // 菜单-根据定位，获取离定位最近店铺的 手机app商品
	GetStoreGoodsDetail: 'Goods/GetGoodsDetail',           // 根据商品商品编号获取详情
	MycareGoods: 'My/MycareGoods',                         // 收藏商品
	DeleteCareGoods: 'My/DeleteCareGoods',                 // 取消收藏商品
	GetGoodsFirstCategories:'Goods/GetGoodsFirstCategories',// 获取所有菜单一级分类
	
	// 购物车
	GetCustomerCart: 'Cart/GetCustomerCart',               // 购物车--获取登录用户的购物车
	CreateCustomerCart: 'Cart/CreateCustomerCart',         // 购物车--加入购物车
	CreateMultipleCustomerCart: 'Cart/CreateMultipleCustomerCart',// 批量加入购物车--食谱商品
	UpdateCustomerCart: 'Cart/UpdateCustomerCart',         // 购物车--加或减更新用户的购物车产品数量
	DeleteSigleCustomerCart: 'Cart/DeleteSigleCustomerCart',// 购物车--删除购物车产品
	DeleteAllCustomerCart: 'Cart/DeleteAllCustomerCart',   // 购物车--清空购物车
	GetCustomerCartQuantity: 'Cart/GetCustomerCartQuantity',// 我的购物车总数量
	
	// 我的
	GetMyData: 'My/GetMyData',                             // 获取我的界面数据
	UploadMy: 'My/UploadMy',                               // 我的上传头像
	GetMyCareGoods: 'My/GetMyCareGoods',                   // 我关注的商品
	
	// 收货地址
	GetCustomerAddr: 'Customer/GetCustomerAddr',           // 获取登录用户的收货地址
	UpdateCustomerAddr: 'Customer/UpdateCustomerAddr',     // 修改登录用户的收货地址
	CreateCustomerAddr: 'Customer/CreateCustomerAddr',     // 创建登录用户的收货地址
	DeleteCustomerAddr: 'Customer/DeleteCustomerAddr',     // 删除登录用户的收货地址
	CustomerShareQr:'Customer/CustomerShareQr',             //分享二维码
	CustomerShare : 'Customer/CustomerShare' ,              //微信分享 
	// 食谱
	GetRecipes: 'Recipes/GetRecipes',                      // 获取食谱
	GetRecipesDetail: 'Recipes/GetRecipesDetail',          // 获取食谱详细
	MycareRecipes: 'My/MycareRecipes',                     // 收藏食谱
	DeleteRecipes: 'My/DeleteRecipes',                     // 取消收藏食谱
	QueryRecipes: 'Recipes/QueryRecipes',                  // 食谱----搜索食谱
	GetMyCareRecipes: 'My/GetMyCareRecipes',               // 我关注的食谱
	
	// 团购
	GetGroupOrder: 'GroupOrder/GetEffectiveGroupOrder',    // 获取团购列表
	CreateGroupOrder: 'GroupOrder/CreateGroupOrder',     	 // 创建团购单
	JoinGroupOrder: 'GroupOrder/JoinGroupOrder',					 // 参加团购
	GetMyGroupOrder: 'My/GetMyGroupOrder',                 // 我的团购订单
	PayMyGroup: 'GroupOrder/PayMyGroup',                   // 支付我的团购单
	QureyGroupOrder: 'GroupOrder/SearchGroupOrder',        // 团购-搜索团购产品
	CheckMyGroupOrderPay: 'GroupOrder/CheckMyGroupOrderPay',// 团购是否已经支付
	
	// 订单
	// 订单搜索
	GetAllOrder: 'My/GetAllOrder',                         // 我的所有订单
	GetUnpayOrder: 'My/GetUnpayOrder',										 // 未付款订单
	GetWaitOrder: 'My/GetWaitOrder',                       // 待收货订单
	GetCompleteOrder: 'My/GetCompleteOrder',               // 已完成订单
	GetCancelOrder: 'My/GetCancelOrder',									 // 已取消订单
	CreateOrder: 'Order/CreateOrder',                      // 创建订单
	GetCommentOrder: 'My/GetCommentOrder',                 // 我的已评价订单
	GetUnCommentOrder: 'My/GetUnCommentOrder',             // 待评价订单
	GetOrderPrice: 'Order/GetOrderPrice',                  // 购物车/付款界面 计算订单总价
	GetOrderDetail: 'My/GetOrderDetail',                   // 订单详情
	CancelMyOrder: 'Order/CancelMyOrder',                  // 取消订单
	CancelMyPayOrder: 'Order/CancelMyPayOrder',            // 取消待收货订单
	ConfirmMyOrder:'Order/ConfirmMyOrder',                 // 确认收货
	CommentMyOrder:'Order/CommentMyOrder',                 // 添加评论
	PayMyOrder:'Order/PayMyOrder',                         // 支付我的订单     
	GetCustomerMessage : 'My/GetCustomerMessage',          // 获取我的客服消息
  CreateCustomerMessage : 'My/CreateCustomerMessage',     //创建客服消息
	
	// 售后
	CreateAftermarketOrderMultiple: 'Order/CreateAftermarketOrderMultiple',// 创建售后,频率 每秒最多2次，每分钟最多5次
	CheckMyOrderPay: 'Order/CheckMyOrderPay',              // 付款后，查询是否支付成功,Data 为 True已付款成功，False未付款成功
	GetMyAftermarketOrder:'My/GetMyAftermarketOrder',      //售后订单列表
	
	// 会员
	GetVipCase: 'My/GetVipCase',                           // 获取购买会员方案
	BuyVip: 'My/BuyVip',                                   // 购买会员
	CheckBuyVip: 'My/CheckBuyVip',                         // 购买vip后，查询是否付款成功
	
	// 优惠券
	GetMyUnUseTicket: 'My/GetMyUnUseTicket',               // 获取未使用且有效的电子券
	GetMyUseTicket: 'My/GetMyUseTicket',                   // 获取已使用电子券
	GetMyInvalidTicket: 'My/GetMyInvalidTicket',           // 获取已过期失效电子券
	
}